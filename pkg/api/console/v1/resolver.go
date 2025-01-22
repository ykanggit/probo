//go:generate go run github.com/99designs/gqlgen generate

package console_v1

import "github.com/getprobo/probo/pkg/probo"

type (
	Resolver struct {
		svc *probo.Service
	}
)
