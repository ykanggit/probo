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

package console_v1

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/getprobo/probo/pkg/connector"
	"github.com/getprobo/probo/pkg/coredata"
	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/probo"
	"github.com/getprobo/probo/pkg/saferedirect"
	"github.com/getprobo/probo/pkg/securecookie"
	"github.com/getprobo/probo/pkg/server/api/console/v1/schema"
	"github.com/getprobo/probo/pkg/usrmgr"
	"github.com/go-chi/chi/v5"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

type (
	AuthConfig struct {
		CookieName      string
		CookieDomain    string
		SessionDuration time.Duration
		CookieSecret    string
	}

	Resolver struct {
		proboSvc  *probo.Service
		usrmgrSvc *usrmgr.Service
		authCfg   AuthConfig
	}

	ctxKey struct{ name string }
)

var (
	sessionContextKey    = &ctxKey{name: "session"}
	userContextKey       = &ctxKey{name: "user"}
	userTenantContextKey = &ctxKey{name: "user_tenants"}
	panicValueContextKey = &ctxKey{name: "panic_value"}
)

func SessionFromContext(ctx context.Context) *coredata.Session {
	session, _ := ctx.Value(sessionContextKey).(*coredata.Session)
	return session
}

func UserFromContext(ctx context.Context) *coredata.User {
	user, _ := ctx.Value(userContextKey).(*coredata.User)
	return user
}

func NewMux(proboSvc *probo.Service, usrmgrSvc *usrmgr.Service, authCfg AuthConfig, connectorRegistry *connector.ConnectorRegistry, safeRedirect *saferedirect.SafeRedirect) *chi.Mux {
	r := chi.NewMux()

	r.Post("/auth/register", SignUpHandler(usrmgrSvc, authCfg))
	r.Post("/auth/login", SignInHandler(usrmgrSvc, authCfg))
	r.Delete("/auth/logout", SignOutHandler(usrmgrSvc, authCfg))
	r.Post("/auth/invitation", InvitationConfirmationHandler(usrmgrSvc, authCfg))
	r.Post("/auth/forget-password", ForgetPasswordHandler(usrmgrSvc, authCfg))
	r.Post("/auth/reset-password", ResetPasswordHandler(usrmgrSvc, authCfg))

	r.Get("/connectors/initiate", WithSession(usrmgrSvc, authCfg, func(w http.ResponseWriter, r *http.Request) {
		session := SessionFromContext(r.Context())
		if session == nil {
			panic(fmt.Errorf("session not found"))
		}

		// TODO: check if current user has access to the organization

		connectorID := r.URL.Query().Get("connector_id")
		organizationID := r.URL.Query().Get("organization_id")

		redirectURL, err := connectorRegistry.Initiate(r.Context(), connectorID, organizationID, r)
		if err != nil {
			panic(fmt.Errorf("cannot initiate connector: %w", err))
		}

		http.Redirect(w, r, redirectURL, http.StatusSeeOther)
	}))

	r.Get("/connectors/complete", WithSession(usrmgrSvc, authCfg, func(w http.ResponseWriter, r *http.Request) {
		session := SessionFromContext(r.Context())
		if session == nil {
			panic(fmt.Errorf("session not found"))
		}

		// TODO: check if current user has access to the organization

		connectorID := r.URL.Query().Get("connector_id")
		organizationIDString := r.URL.Query().Get("organization_id")

		connection, err := connectorRegistry.Complete(r.Context(), connectorID, organizationIDString, r)
		if err != nil {
			panic(fmt.Errorf("failed to complete connector: %w", err))
		}

		organizationID, err := gid.ParseGID(organizationIDString)
		if err != nil {
			panic(fmt.Errorf("failed to parse organization id: %w", err))
		}

		tenantID := session.ID.TenantID()
		_, err = proboSvc.WithTenant(tenantID).Connectors.CreateOrUpdate(
			r.Context(),
			probo.CreateOrUpdateConnectorRequest{
				OrganizationID: organizationID,
				Name:           connectorID,
				Type:           connector.ProtocolType(connection.Type()),
				Connection:     connection,
			},
		)
		if err != nil {
			panic(fmt.Errorf("failed to create or update connector: %w", err))
		}

		safeRedirect.RedirectFromQuery(w, r, "continue", "/", http.StatusSeeOther)
	}))

	r.Get("/", playground.Handler("GraphQL", "/api/console/v1/query"))
	r.Post("/query", graphqlHandler(proboSvc, usrmgrSvc, authCfg))

	return r
}

func graphqlHandler(proboSvc *probo.Service, usrmgrSvc *usrmgr.Service, authCfg AuthConfig) http.HandlerFunc {
	var mb int64 = 1 << 20

	es := schema.NewExecutableSchema(
		schema.Config{
			Resolvers: &Resolver{
				proboSvc:  proboSvc,
				usrmgrSvc: usrmgrSvc,
				authCfg:   authCfg,
			},
		},
	)
	srv := handler.New(es)
	srv.AddTransport(transport.POST{})
	srv.AddTransport(
		transport.MultipartForm{
			MaxMemory:     32 * mb,
			MaxUploadSize: 50 * mb,
		},
	)
	srv.Use(extension.Introspection{})
	srv.Use(tracingExtension{})
	srv.SetRecoverFunc(func(ctx context.Context, err any) error {
		panicValue := ctx.Value(panicValueContextKey).(*any)
		*panicValue = err
		return fmt.Errorf("resolver panic: %v", err)
	})

	srv.AroundOperations(
		func(ctx context.Context, next graphql.OperationHandler) graphql.ResponseHandler {
			user := UserFromContext(ctx)

			if user == nil {
				return func(ctx context.Context) *graphql.Response {
					return &graphql.Response{
						Errors: gqlerror.List{
							&gqlerror.Error{
								Message: "authentication required",
								Extensions: map[string]any{
									"code": "UNAUTHENTICATED",
								},
							},
						},
					}
				}
			}

			return next(ctx)
		},
	)

	return WithSession(usrmgrSvc, authCfg, func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		// Hack to capture the panic value, because gqlgen execute resolver in a different goroutine.
		// And I want use the go.gearno.de/kit/httpserver built in panic recovery.
		var panicValue any
		ctx = context.WithValue(ctx, panicValueContextKey, &panicValue)

		srv.ServeHTTP(w, r.WithContext(ctx))

		if panicValue != nil {
			panic(panicValue)
		}
	})
}

func WithSession(usrmgrSvc *usrmgr.Service, authCfg AuthConfig, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		cookieValue, err := securecookie.Get(r, securecookie.DefaultConfig(
			authCfg.CookieName,
			authCfg.CookieSecret,
		))
		if err != nil {
			if !errors.Is(err, securecookie.ErrCookieNotFound) {
				panic(fmt.Errorf("failed to get session: %w", err))
			}

			next(w, r)
			return
		}

		sessionID, err := gid.ParseGID(cookieValue)
		if err != nil {
			securecookie.Clear(w, securecookie.DefaultConfig(
				authCfg.CookieName,
				authCfg.CookieSecret,
			))

			next(w, r)
			return
		}

		session, err := usrmgrSvc.GetSession(ctx, sessionID)
		if err != nil {
			securecookie.Clear(w, securecookie.DefaultConfig(
				authCfg.CookieName,
				authCfg.CookieSecret,
			))

			next(w, r)
			return
		}

		user, err := usrmgrSvc.GetUserBySession(ctx, sessionID)
		if err != nil {
			securecookie.Clear(w, securecookie.DefaultConfig(
				authCfg.CookieName,
				authCfg.CookieSecret,
			))

			next(w, r)
			return
		}

		tenantIDs, err := usrmgrSvc.ListTenantsForUserID(ctx, user.ID)
		if err != nil {
			panic(fmt.Errorf("failed to list tenants for user: %w", err))
		}

		ctx = context.WithValue(ctx, sessionContextKey, session)
		ctx = context.WithValue(ctx, userContextKey, user)
		ctx = context.WithValue(ctx, userTenantContextKey, &tenantIDs)

		next(w, r.WithContext(ctx))

		// Update session after the handler completes
		if err := usrmgrSvc.UpdateSession(ctx, session); err != nil {
			panic(fmt.Errorf("failed to update session: %w", err))
		}
	}
}

func (r *Resolver) GetTenantServiceIfAuthorized(ctx context.Context, tenantID gid.TenantID) *probo.TenantService {
	tenantIDs, _ := ctx.Value(userTenantContextKey).(*[]gid.TenantID)

	if tenantIDs == nil {
		panic(fmt.Errorf("tenant not found"))
	}

	for _, id := range *tenantIDs {
		if id == tenantID {
			return r.proboSvc.WithTenant(tenantID)
		}
	}

	panic(fmt.Errorf("tenant not found"))
}
