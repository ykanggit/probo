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
	"fmt"
	"net/http"
	"sync"
)

type (
	ConnectorRegistry struct {
		sync.RWMutex
		connectors map[string]Connector
	}
)

func NewConnectorRegistry() *ConnectorRegistry {
	return &ConnectorRegistry{
		connectors: make(map[string]Connector),
	}
}

func (cr *ConnectorRegistry) Register(connectorID string, connector Connector) {
	cr.Lock()
	defer cr.Unlock()
	cr.connectors[connectorID] = connector
}

func (cr *ConnectorRegistry) Get(connectorID string) (Connector, error) {
	cr.RLock()
	defer cr.RUnlock()
	connector, ok := cr.connectors[connectorID]
	if !ok {
		return nil, fmt.Errorf("connector %q not found", connectorID)
	}
	return connector, nil
}

func (cr *ConnectorRegistry) Initiate(ctx context.Context, connectorID string, organizationID string, r *http.Request) (string, error) {
	connector, err := cr.Get(connectorID)
	if err != nil {
		return "", fmt.Errorf("cannot initiate connector: %w", err)
	}

	return connector.Initiate(ctx, connectorID, organizationID, r)
}

func (cr *ConnectorRegistry) Complete(ctx context.Context, connectorID string, organizationID string, r *http.Request) (Connection, error) {
	connector, err := cr.Get(connectorID)
	if err != nil {
		return nil, fmt.Errorf("cannot complete connector: %w", err)
	}

	return connector.Complete(ctx, connectorID, organizationID, r)
}
