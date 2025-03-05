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

package probod

import (
	"encoding/base64"
	"fmt"
)

type (
	authConfig struct {
		// Pepper is a secret key used for password hashing
		// It should be at least 32 bytes long
		Pepper          string `json:"pepper"`
		SessionDuration int    `json:"session-duration"`
		CookieName      string `json:"cookie-name"`
		CookieSecure    bool   `json:"cookie-secure"`
		CookieHTTPOnly  bool   `json:"cookie-http-only"`
		CookieDomain    string `json:"cookie-domain"`
		CookiePath      string `json:"cookie-path"`
		CookieSecret string `json:"cookie-secret"`
	}
)

func (c authConfig) GetPepperBytes() ([]byte, error) {
	if c.Pepper == "" {
		return nil, fmt.Errorf("pepper cannot be empty")
	}

	if decoded, err := base64.StdEncoding.DecodeString(c.Pepper); err == nil {
		if len(decoded) < 32 {
			return nil, fmt.Errorf("decoded pepper must be at least 32 bytes long")
		}
		return decoded, nil
	}

	if len(c.Pepper) < 32 {
		return nil, fmt.Errorf("pepper must be at least 32 bytes long")
	}

	return []byte(c.Pepper), nil
}

func (c authConfig) GetCookieSecretBytes() ([]byte, error) {
	if c.CookieSecret == "" {
		return nil, fmt.Errorf("cookie secret cannot be empty")
	}

	if decoded, err := base64.StdEncoding.DecodeString(c.CookieSecret); err == nil {
		if len(decoded) < 32 {
			return nil, fmt.Errorf("decoded cookie secret must be at least 32 bytes long")
		}
		return decoded, nil
	}

	if len(c.CookieSecret) < 32 {
		return nil, fmt.Errorf("cookie secret must be at least 32 bytes long")
	}

	return []byte(c.CookieSecret), nil
}
