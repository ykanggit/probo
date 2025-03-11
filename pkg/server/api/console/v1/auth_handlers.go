package console_v1

import (
	"github.com/getprobo/probo/pkg/usrmgr"
	"github.com/go-chi/chi/v5"
)

type (
	RegisterRequest struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		FullName string `json:"fullName"`
	}
)

// RegisterAuthRoutes registers the authentication routes
func RegisterAuthRoutes(r chi.Router, usrmgrSvc *usrmgr.Service, authCfg AuthConfig) {
	r.Post("/auth/register", SignUpHandler(usrmgrSvc, authCfg))
	r.Post("/auth/login", SignInHandler(usrmgrSvc, authCfg))
	r.Post("/auth/logout", SignOutHandler(usrmgrSvc, authCfg))
}
