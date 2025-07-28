//go:generate go run github.com/99designs/gqlgen generate

// Copyright (c) 2025 Probo Inc <hello@getprobo.com>.
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
// AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
// LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
// OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.

package trust_v1

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"runtime/debug"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/getprobo/probo/pkg/coredata"
	"github.com/getprobo/probo/pkg/crypto/cipher"
	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/securecookie"
	"github.com/getprobo/probo/pkg/server/api/trust/v1/schema"
	"github.com/getprobo/probo/pkg/server/api/trust/v1/types"
	"github.com/getprobo/probo/pkg/trust"
	"github.com/getprobo/probo/pkg/usrmgr"
	"github.com/go-chi/chi/v5"
	"go.gearno.de/kit/httpserver"
	"go.gearno.de/kit/log"
)

type (
	AuthConfig struct {
		CookieName      string
		CookieDomain    string
		SessionDuration time.Duration
		CookieSecret    string
	}

	Resolver struct {
		trustCenterSvc *trust.Service
		authCfg        AuthConfig
	}

	ctxKey struct{ name string }

	TokenAccessData struct {
		TrustCenterID gid.GID
		Email         string
		TenantID      gid.TenantID
		Scope         string
	}

	TrustCenterTokenData struct {
		TrustCenterID gid.GID      `json:"trust_center_id"`
		Email         string       `json:"email"`
		TenantID      gid.TenantID `json:"tenant_id"`
		Scope         string       `json:"scope"`
		ExpiresAt     time.Time    `json:"expires_at"`
	}
)

const (
	TokenScopeTrustCenterReadOnly = "trust_center_readonly"
	TokenCookieName               = "trust_center_token"
)

var (
	sessionContextKey     = &ctxKey{name: "session"}
	userContextKey        = &ctxKey{name: "user"}
	userTenantContextKey  = &ctxKey{name: "user_tenants"}
	tokenAccessContextKey = &ctxKey{name: "token_access"}
)

func SessionFromContext(ctx context.Context) *coredata.Session {
	session, _ := ctx.Value(sessionContextKey).(*coredata.Session)
	return session
}

func UserFromContext(ctx context.Context) *coredata.User {
	user, _ := ctx.Value(userContextKey).(*coredata.User)
	return user
}

func TokenAccessFromContext(ctx context.Context) *TokenAccessData {
	tokenAccess, _ := ctx.Value(tokenAccessContextKey).(*TokenAccessData)
	return tokenAccess
}

func GetCurrentUserRole(ctx context.Context) types.Role {
	user := UserFromContext(ctx)
	tokenAccess := TokenAccessFromContext(ctx)

	if user != nil || tokenAccess != nil {
		return types.RoleUser
	}
	return types.RoleNone
}

func NewMux(
	logger *log.Logger,
	usrmgrSvc *usrmgr.Service,
	trustSvc *trust.Service,
	authCfg AuthConfig,
) *chi.Mux {
	r := chi.NewMux()

	encryptionKey := trustSvc.GetEncryptionKey()

	r.Handle("/graphql", graphqlHandler(logger, usrmgrSvc, trustSvc, authCfg, encryptionKey))

	r.Handle("/playground", playground.Handler("GraphQL Playground", "/api/trust/v1/graphql"))

	r.Post("/trust-center-access/authenticate", authTokenHandler(trustSvc, authCfg, encryptionKey))
	r.Delete("/trust-center-access/logout", trustCenterLogoutHandler(authCfg))

	return r
}

func graphqlHandler(logger *log.Logger, usrmgrSvc *usrmgr.Service, trustSvc *trust.Service, authCfg AuthConfig, encryptionKey cipher.EncryptionKey) http.HandlerFunc {
	var mb int64 = 1 << 20

	c := schema.Config{
		Resolvers: &Resolver{
			trustCenterSvc: trustSvc,
			authCfg:        authCfg,
		},
	}

	c.Directives.MustBeAuthenticated = func(ctx context.Context, obj interface{}, next graphql.Resolver, role *types.Role) (interface{}, error) {
		currentRole := GetCurrentUserRole(ctx)

		if role != nil && *role == types.RoleUser && currentRole == types.RoleNone {
			return nil, fmt.Errorf("access denied: authentication required")
		}

		return next(ctx)
	}

	es := schema.NewExecutableSchema(c)

	srv := handler.New(es)

	srv.AddTransport(transport.POST{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.Options{})
	srv.AddTransport(
		transport.MultipartForm{
			MaxMemory:     32 * mb,
			MaxUploadSize: 50 * mb,
		},
	)

	srv.Use(extension.Introspection{})

	srv.SetRecoverFunc(func(ctx context.Context, err any) error {
		logger := httpserver.LoggerFromContext(ctx)
		logger.Error("resolver panic", log.Any("error", err), log.Any("stack", string(debug.Stack())))

		return errors.New("internal server error")
	})

	return WithSession(usrmgrSvc, trustSvc, authCfg, encryptionKey, srv.ServeHTTP)
}

// TrustService returns a trust service scoped to the given tenant
func (r *Resolver) TrustService(ctx context.Context, tenantID gid.TenantID) *trust.TenantService {
	return r.trustCenterSvc.WithTenant(tenantID)
}

// GetTenantService returns a tenant service for the given tenant ID
func (r *Resolver) GetTenantService(ctx context.Context, tenantID gid.TenantID) *trust.TenantService {
	return r.trustCenterSvc.WithTenant(tenantID)
}

func WithSession(usrmgrSvc *usrmgr.Service, trustSvc *trust.Service, authCfg AuthConfig, encryptionKey cipher.EncryptionKey, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		cookieValue, err := securecookie.Get(r, securecookie.DefaultConfig(
			authCfg.CookieName,
			authCfg.CookieSecret,
		))

		if err == nil {
			sessionID, err := gid.ParseGID(cookieValue)
			if err == nil {
				session, err := usrmgrSvc.GetSession(ctx, sessionID)
				if err == nil {
					user, err := usrmgrSvc.GetUserBySession(ctx, sessionID)
					if err == nil {
						tenantIDs, err := usrmgrSvc.ListTenantsForUserID(ctx, user.ID)
						if err == nil {
							ctx = context.WithValue(ctx, sessionContextKey, session)
							ctx = context.WithValue(ctx, userContextKey, user)
							ctx = context.WithValue(ctx, userTenantContextKey, &tenantIDs)

							next(w, r.WithContext(ctx))

							if err := usrmgrSvc.UpdateSession(ctx, session); err != nil {
								panic(fmt.Errorf("failed to update session: %w", err))
							}
							return
						}
					}
				}
			}

			securecookie.Clear(w, securecookie.DefaultConfig(
				authCfg.CookieName,
				authCfg.CookieSecret,
			))
		}

		tokenCookieValue, err := securecookie.Get(r, securecookie.Config{
			Name:   TokenCookieName,
			Secret: authCfg.CookieSecret,
		})

		if err == nil {
			encryptedData, err := base64.StdEncoding.DecodeString(tokenCookieValue)
			if err == nil {
				decryptedData, err := cipher.Decrypt(encryptedData, encryptionKey)
				if err == nil {
					var tokenData TrustCenterTokenData
					if err := json.Unmarshal(decryptedData, &tokenData); err == nil {
						if time.Now().Before(tokenData.ExpiresAt) {
							tenantSvc := trustSvc.WithTenant(tokenData.TenantID)
							isActive, err := tenantSvc.TrustCenterAccesses.IsAccessActive(ctx, tokenData.TrustCenterID, tokenData.Email)

							if err == nil && isActive {
								tokenAccess := &TokenAccessData{
									TrustCenterID: tokenData.TrustCenterID,
									Email:         tokenData.Email,
									TenantID:      tokenData.TenantID,
									Scope:         tokenData.Scope,
								}

								ctx = context.WithValue(ctx, tokenAccessContextKey, tokenAccess)
								next(w, r.WithContext(ctx))
								return
							} else {
								securecookie.Clear(w, securecookie.Config{
									Name:   TokenCookieName,
									Secret: authCfg.CookieSecret,
								})
							}
						} else {
							securecookie.Clear(w, securecookie.Config{
								Name:   TokenCookieName,
								Secret: authCfg.CookieSecret,
							})
						}
					}
				}
			}
		}

		// Continue without authentication for public access
		next(w, r.WithContext(ctx))
	}
}
