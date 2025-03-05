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
	"fmt"
	"net/http"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/getprobo/probo/pkg/api/console/v1/schema"
	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/probo"
	"github.com/getprobo/probo/pkg/usrmgr"
	"github.com/getprobo/probo/pkg/usrmgr/coredata"
	"github.com/go-chi/chi/v5"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

type (
	AuthConfig struct {
		CookieName      string
		CookieSecure    bool
		CookieHTTPOnly  bool
		CookieDomain    string
		CookiePath      string
		SessionDuration time.Duration
		CookieSecret    string
	}

	Resolver struct {
		proboSvc  *probo.Service
		usrmgrSvc *usrmgr.Service
		authCfg   AuthConfig
	}

	contextKey string

	httpContext struct {
		ResponseWriter http.ResponseWriter
		Request        *http.Request
	}
)

const (
	sessionContextKey contextKey = "session"
	userContextKey    contextKey = "user"
	httpContextKey    contextKey = "http"
)

// SessionFromContext retrieves the session from the context
func SessionFromContext(ctx context.Context) *coredata.Session {
	session, _ := ctx.Value(sessionContextKey).(*coredata.Session)
	return session
}

// UserFromContext retrieves the user from the context
func UserFromContext(ctx context.Context) *coredata.User {
	user, _ := ctx.Value(userContextKey).(*coredata.User)
	return user
}

func NewMux(proboSvc *probo.Service, usrmgrSvc *usrmgr.Service, authCfg AuthConfig) *chi.Mux {
	r := chi.NewMux()

	// Register authentication routes
	RegisterAuthRoutes(r, usrmgrSvc, authCfg)

	// GraphQL playground and query endpoint
	r.Get("/", playground.Handler("GraphQL", "/console/v1/query"))
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
	srv.AddTransport(transport.MultipartForm{
		MaxMemory:     32 * mb,
		MaxUploadSize: 50 * mb,
	})
	srv.Use(extension.Introspection{})

	// Add operation middleware for authentication
	srv.AroundOperations(func(ctx context.Context, next graphql.OperationHandler) graphql.ResponseHandler {
		// Skip authentication for introspection queries
		if op := graphql.GetOperationContext(ctx); op.OperationName == "IntrospectionQuery" {
			return next(ctx)
		}

		// Get the user from context
		user := UserFromContext(ctx)
		if user == nil {
			return func(ctx context.Context) *graphql.Response {
				return &graphql.Response{
					Errors: gqlerror.List{gqlerror.Errorf("authentication required")},
				}
			}
		}

		// Continue with the operation
		return next(ctx)
	})

	return func(w http.ResponseWriter, r *http.Request) {
		// Create HTTP context
		httpCtx := &httpContext{
			ResponseWriter: w,
			Request:        r,
		}
		ctx := context.WithValue(r.Context(), httpContextKey, httpCtx)

		// Extract session from cookie
		cookie, err := r.Cookie(authCfg.CookieName)
		if err == nil && cookie.Value != "" {
			// Verify the cookie signature
			originalValue, err := verifyCookieValue(cookie.Value, authCfg.CookieSecret)
			if err == nil {
				// Parse the session ID
				sessionID, err := gid.ParseGID(originalValue)
				if err == nil {
					// Get the session
					session, err := usrmgrSvc.GetSession(r.Context(), sessionID)
					if err == nil {
						// Add session to context
						ctx = context.WithValue(ctx, sessionContextKey, session)

						// Get the user
						user, err := usrmgrSvc.GetUserBySession(r.Context(), sessionID)
						if err == nil {
							// Add user to context
							ctx = context.WithValue(ctx, userContextKey, user)
						}
					}
				}
			}
		}

		srv.ServeHTTP(w, r.WithContext(ctx))

		if session := SessionFromContext(r.Context()); session != nil {
			if err := usrmgrSvc.UpdateSession(r.Context(), session); err != nil {
				panic(fmt.Errorf("failed to update session: %w", err))
			}
		}
	}
}
