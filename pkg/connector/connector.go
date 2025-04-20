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

package connector

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
)

type (
	ProtocolType string

	Connector interface {
		Initiate(ctx context.Context, connectorID string, organizationID string, r *http.Request) (string, error)
		Complete(ctx context.Context, connectorID string, organizationID string, r *http.Request) (Connection, error)
	}

	Connection interface {
		Type() ProtocolType
		Client(ctx context.Context) (*http.Client, error)

		json.Unmarshaler
		json.Marshaler
	}
)

const (
	ProtocolOAuth2 ProtocolType = "oauth2"
)

func UnmarshalConnection(data []byte) (Connection, error) {
	var typeContainer struct {
		Type string `json:"type"`
	}

	if err := json.Unmarshal(data, &typeContainer); err != nil {
		return nil, fmt.Errorf("failed to unmarshal connection type: %w", err)
	}

	var conn Connection

	switch ProtocolType(typeContainer.Type) {
	case ProtocolOAuth2:
		conn = &OAuth2Connection{}
	default:
		return nil, fmt.Errorf("unknown connection type: %s", typeContainer.Type)
	}

	if err := conn.UnmarshalJSON(data); err != nil {
		return nil, err
	}

	return conn, nil
}
