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
	"encoding/json"
	"fmt"

	"github.com/getprobo/probo/pkg/connector"
)

type (
	connectorConfig struct {
		Name   string              `json:"name"`
		Type   string              `json:"type"`
		Config connector.Connector `json:"-"`
	}

	connectorOAuth2Config struct {
		ClientID     string   `json:"client-id"`
		ClientSecret string   `json:"client-secret"`
		RedirectURI  string   `json:"redirect-uri"`
		Scopes       []string `json:"scopes"`
		AuthURL      string   `json:"auth-url"`
		TokenURL     string   `json:"token-url"`
	}
)

func (c *connectorConfig) UnmarshalJSON(data []byte) error {
	var tmp struct {
		Name      string          `json:"name"`
		Type      string          `json:"type"`
		RawConfig json.RawMessage `json:"config"`
	}

	if err := json.Unmarshal(data, &tmp); err != nil {
		return fmt.Errorf("cannot unmarshal connector config: %w", err)
	}

	c.Name = tmp.Name
	c.Type = tmp.Type

	switch tmp.Type {
	case "oauth2":
		var cfg connectorOAuth2Config
		if err := json.Unmarshal(tmp.RawConfig, &cfg); err != nil {
			return fmt.Errorf("cannot unmarshal oauth2 config: %w", err)
		}

		if cfg.ClientID == "" || cfg.ClientSecret == "" || cfg.AuthURL == "" || cfg.TokenURL == "" || cfg.RedirectURI == "" {
			return fmt.Errorf("oauth2 config: client-id, client-secret, auth-url, token-url and redirect-uri are required")
		}

		c.Config = &connector.OAuth2Connector{
			ClientID:     cfg.ClientID,
			ClientSecret: cfg.ClientSecret,
			RedirectURI:  cfg.RedirectURI,
			Scopes:       cfg.Scopes,
			AuthURL:      cfg.AuthURL,
			TokenURL:     cfg.TokenURL,
		}
	default:
		return fmt.Errorf("unknown %q connector type: %s", tmp.Name, tmp.Type)
	}

	return nil
}
