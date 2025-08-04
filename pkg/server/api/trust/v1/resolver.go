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
	"errors"
	"fmt"
	"net/http"
	"runtime/debug"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/getprobo/probo/pkg/coredata"
	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/probo"
	"github.com/getprobo/probo/pkg/securecookie"
	"github.com/getprobo/probo/pkg/server/api/trust/v1/auth"
	"github.com/getprobo/probo/pkg/server/api/trust/v1/schema"
	"github.com/getprobo/probo/pkg/statelesstoken"
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

func TokenAccessFromContext(ctx context.Context) *auth.TokenAccessData {
	tokenAccess, _ := ctx.Value(tokenAccessContextKey).(*auth.TokenAccessData)
	return tokenAccess
}

// UserFromContext implements auth.ContextAccessor interface
func (r *Resolver) UserFromContext(ctx context.Context) *coredata.User {
	return UserFromContext(ctx)
}

// TokenAccessFromContext implements auth.ContextAccessor interface
func (r *Resolver) TokenAccessFromContext(ctx context.Context) *auth.TokenAccessData {
	return TokenAccessFromContext(ctx)
}

func NewMux(
	logger *log.Logger,
	usrmgrSvc *usrmgr.Service,
	trustSvc *trust.Service,
	authCfg AuthConfig,
) *chi.Mux {
	r := chi.NewMux()

	r.Handle("/graphql", graphqlHandler(logger, usrmgrSvc, trustSvc, authCfg))

	r.Handle("/playground", playground.Handler("GraphQL Playground", "/api/trust/v1/graphql"))

	r.Post("/auth/authenticate", authTokenHandler(trustSvc, authCfg))
	r.Delete("/auth/logout", trustCenterLogoutHandler(authCfg))

	return r
}

func graphqlHandler(logger *log.Logger, usrmgrSvc *usrmgr.Service, trustSvc *trust.Service, authCfg AuthConfig) http.HandlerFunc {
	var mb int64 = 1 << 20

	resolver := &Resolver{
		trustCenterSvc: trustSvc,
		authCfg:        authCfg,
	}

	c := schema.Config{
		Resolvers: resolver,
	}

	c.Directives.MustBeAuthenticated = auth.MustBeAuthenticatedDirective(resolver)

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

	return WithSession(usrmgrSvc, trustSvc, authCfg, srv.ServeHTTP)
}

// TrustService returns a trust service scoped to the given tenant
func (r *Resolver) TrustService(ctx context.Context, tenantID gid.TenantID) *trust.TenantService {
	return r.trustCenterSvc.WithTenant(tenantID)
}

// GetTenantService returns a tenant service for the given tenant ID
func (r *Resolver) GetTenantService(ctx context.Context, tenantID gid.TenantID) *trust.TenantService {
	return r.trustCenterSvc.WithTenant(tenantID)
}

func WithSession(usrmgrSvc *usrmgr.Service, trustSvc *trust.Service, authCfg AuthConfig, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		if authCtx := trySessionAuth(ctx, w, r, usrmgrSvc, authCfg); authCtx != nil {
			next(w, r.WithContext(authCtx))
			updateSessionIfNeeded(authCtx, usrmgrSvc)
			return
		}

		if authCtx := tryTokenAuth(ctx, w, r, trustSvc, authCfg); authCtx != nil {
			next(w, r.WithContext(authCtx))
			return
		}

		next(w, r.WithContext(ctx))
	}
}

func trySessionAuth(ctx context.Context, w http.ResponseWriter, r *http.Request, usrmgrSvc *usrmgr.Service, authCfg AuthConfig) context.Context {
	cookieValue, err := securecookie.Get(r, securecookie.DefaultConfig(
		authCfg.CookieName,
		authCfg.CookieSecret,
	))
	if err != nil {
		return nil
	}

	sessionID, err := gid.ParseGID(cookieValue)
	if err != nil {
		clearSessionCookie(w, authCfg)
		return nil
	}

	session, err := usrmgrSvc.GetSession(ctx, sessionID)
	if err != nil {
		clearSessionCookie(w, authCfg)
		return nil
	}

	user, err := usrmgrSvc.GetUserBySession(ctx, sessionID)
	if err != nil {
		clearSessionCookie(w, authCfg)
		return nil
	}

	tenantIDs, err := usrmgrSvc.ListTenantsForUserID(ctx, user.ID)
	if err != nil {
		clearSessionCookie(w, authCfg)
		return nil
	}

	ctx = context.WithValue(ctx, sessionContextKey, session)
	ctx = context.WithValue(ctx, userContextKey, user)
	ctx = context.WithValue(ctx, userTenantContextKey, &tenantIDs)

	return ctx
}

func tryTokenAuth(ctx context.Context, w http.ResponseWriter, r *http.Request, trustSvc *trust.Service, authCfg AuthConfig) context.Context {
	cookie, err := r.Cookie(TokenCookieName)
	if err != nil {
		return nil
	}

	payload, err := statelesstoken.ValidateToken[probo.TrustCenterAccessData](
		authCfg.CookieSecret,
		probo.TokenTypeTrustCenterAccess,
		cookie.Value,
	)
	if err != nil {
		clearTokenCookie(w, authCfg)
		return nil
	}

	tenantID := payload.Data.TrustCenterID.TenantID()

	tokenAccess := &auth.TokenAccessData{
		TrustCenterID: payload.Data.TrustCenterID,
		Email:         payload.Data.Email,
		TenantID:      tenantID,
		Scope:         TokenScopeTrustCenterReadOnly,
	}

	return context.WithValue(ctx, tokenAccessContextKey, tokenAccess)
}

func clearSessionCookie(w http.ResponseWriter, authCfg AuthConfig) {
	securecookie.Clear(w, securecookie.DefaultConfig(
		authCfg.CookieName,
		authCfg.CookieSecret,
	))
}

func clearTokenCookie(w http.ResponseWriter, authCfg AuthConfig) {
	http.SetCookie(w, &http.Cookie{
		Name:     TokenCookieName,
		Value:    "",
		Domain:   authCfg.CookieDomain,
		Path:     "/",
		MaxAge:   -1,
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
	})
}

func updateSessionIfNeeded(ctx context.Context, usrmgrSvc *usrmgr.Service) {
	session := SessionFromContext(ctx)
	if session != nil {
		if err := usrmgrSvc.UpdateSession(ctx, session); err != nil {
			panic(fmt.Errorf("failed to update session: %w", err))
		}
	}
}
