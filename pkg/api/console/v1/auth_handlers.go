package console_v1

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/usrmgr"
	"github.com/go-chi/chi/v5"
)

type (
	// RegisterRequest represents the request body for user registration
	RegisterRequest struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		FullName string `json:"fullName"`
	}

	// LoginRequest represents the request body for user login
	LoginRequest struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	// AuthResponse represents the response for successful authentication
	AuthResponse struct {
		User    UserResponse    `json:"user"`
		Session SessionResponse `json:"session"`
	}

	// UserResponse represents user data in the authentication response
	UserResponse struct {
		ID        gid.GID   `json:"id"`
		Email     string    `json:"email"`
		FullName  string    `json:"fullName"`
		CreatedAt time.Time `json:"createdAt"`
		UpdatedAt time.Time `json:"updatedAt"`
	}

	// SessionResponse represents session data in the authentication response
	SessionResponse struct {
		ID        gid.GID   `json:"id"`
		ExpiresAt time.Time `json:"expiresAt"`
	}
)

// RegisterHandler handles user registration
func RegisterHandler(usrmgrSvc *usrmgr.Service, authCfg AuthConfig) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Parse request body
		var req RegisterRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Validate request
		if req.Email == "" || req.Password == "" {
			http.Error(w, "Email and password are required", http.StatusBadRequest)
			return
		}

		// Register the user
		user, err := usrmgrSvc.RegisterUser(
			r.Context(),
			usrmgr.RegisterUserParams{
				Email:    req.Email,
				Password: req.Password,
				FullName: req.FullName,
			},
		)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to register user: %v", err), http.StatusInternalServerError)
			return
		}

		// Log the user in
		session, err := usrmgrSvc.Login(r.Context(), req.Email, req.Password)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to login after registration: %v", err), http.StatusInternalServerError)
			return
		}

		// Set the session cookie
		setSessionCookie(w, session.ID.String(), authCfg)

		// Return response
		resp := AuthResponse{
			User: UserResponse{
				ID:        user.ID,
				Email:     user.EmailAddress,
				FullName:  user.FullName,
				CreatedAt: user.CreatedAt,
				UpdatedAt: user.UpdatedAt,
			},
			Session: SessionResponse{
				ID:        session.ID,
				ExpiresAt: session.ExpiredAt,
			},
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			return
		}
	}
}

// LoginHandler handles user login
func LoginHandler(usrmgrSvc *usrmgr.Service, authCfg AuthConfig) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Parse request body
		var req LoginRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Validate request
		if req.Email == "" || req.Password == "" {
			http.Error(w, "Email and password are required", http.StatusBadRequest)
			return
		}

		// Login the user
		session, err := usrmgrSvc.Login(r.Context(), req.Email, req.Password)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to login: %v", err), http.StatusUnauthorized)
			return
		}

		// Get the user
		user, err := usrmgrSvc.GetUserBySession(r.Context(), session.ID)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to get user: %v", err), http.StatusInternalServerError)
			return
		}

		// Set the session cookie
		setSessionCookie(w, session.ID.String(), authCfg)

		// Return response
		resp := AuthResponse{
			User: UserResponse{
				ID:        user.ID,
				Email:     user.EmailAddress,
				FullName:  user.FullName,
				CreatedAt: user.CreatedAt,
				UpdatedAt: user.UpdatedAt,
			},
			Session: SessionResponse{
				ID:        session.ID,
				ExpiresAt: session.ExpiredAt,
			},
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			return
		}
	}
}

// LogoutHandler handles user logout
func LogoutHandler(usrmgrSvc *usrmgr.Service, authCfg AuthConfig) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get session from cookie
		cookie, err := r.Cookie(authCfg.CookieName)
		if err != nil || cookie.Value == "" {
			http.Error(w, "No active session", http.StatusBadRequest)
			return
		}

		// Verify the cookie signature
		originalValue, err := verifyCookieValue(cookie.Value, authCfg.CookieSecret)
		if err != nil {
			http.Error(w, "Invalid session cookie", http.StatusBadRequest)
			return
		}

		// Parse the session ID
		sessionID, err := gid.ParseGID(originalValue)
		if err != nil {
			http.Error(w, "Invalid session ID", http.StatusBadRequest)
			return
		}

		// Logout the user
		err = usrmgrSvc.Logout(r.Context(), sessionID)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to logout: %v", err), http.StatusInternalServerError)
			return
		}

		// Clear the session cookie
		clearSessionCookie(w, authCfg)

		// Return success response
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]bool{"success": true})
	}
}

// RegisterAuthRoutes registers the authentication routes
func RegisterAuthRoutes(r chi.Router, usrmgrSvc *usrmgr.Service, authCfg AuthConfig) {
	r.Post("/auth/register", RegisterHandler(usrmgrSvc, authCfg))
	r.Post("/auth/login", LoginHandler(usrmgrSvc, authCfg))
	r.Post("/auth/logout", LogoutHandler(usrmgrSvc, authCfg))
}
