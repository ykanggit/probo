package console_v1

import (
	"net/http"
)

// setSessionCookie sets a session cookie in the response
func setSessionCookie(w http.ResponseWriter, sessionID string, cfg AuthConfig) {
	// Sign the session ID
	signedValue := signCookieValue(sessionID, cfg.CookieSecret)

	cookie := &http.Cookie{
		Name:     cfg.CookieName,
		Value:    signedValue,
		Path:     cfg.CookiePath,
		Domain:   cfg.CookieDomain,
		Secure:   cfg.CookieSecure,
		HttpOnly: cfg.CookieHTTPOnly,
		MaxAge:   int(cfg.SessionDuration.Seconds()),
		SameSite: http.SameSiteLaxMode,
	}
	http.SetCookie(w, cookie)
}

// clearSessionCookie clears the session cookie
func clearSessionCookie(w http.ResponseWriter, cfg AuthConfig) {
	cookie := &http.Cookie{
		Name:     cfg.CookieName,
		Value:    "",
		Path:     cfg.CookiePath,
		Domain:   cfg.CookieDomain,
		Secure:   cfg.CookieSecure,
		HttpOnly: cfg.CookieHTTPOnly,
		MaxAge:   -1,
		SameSite: http.SameSiteLaxMode,
	}
	http.SetCookie(w, cookie)
}
