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
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/getprobo/probo/pkg/api/console/v1/schema"
	"github.com/getprobo/probo/pkg/probo"
	"github.com/go-chi/chi/v5"
)

type (
	Resolver struct {
		svc *probo.Service
	}
)

func NewMux(probo *probo.Service) *chi.Mux {
	r := chi.NewMux()
	r.Get("/", playground.Handler("GraphQL", "/console/v1/query"))
	r.Post("/query", graphql(probo))

	return r
}

func graphql(probo *probo.Service) http.HandlerFunc {
	es := schema.NewExecutableSchema(
		schema.Config{
			Resolvers: &Resolver{
				svc: probo,
			},
		},
	)
	srv := handler.New(es)
	srv.AddTransport(transport.POST{})
	srv.Use(extension.Introspection{})

	return func(w http.ResponseWriter, r *http.Request) {
		srv.ServeHTTP(w, r)
	}
}
