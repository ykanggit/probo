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

package probo

import (
	"context"
	"fmt"
	"time"

	"github.com/getprobo/probo/pkg/connector"
	"github.com/getprobo/probo/pkg/coredata"
	"github.com/getprobo/probo/pkg/gid"
	"go.gearno.de/kit/pg"
)

type (
	ConnectorService struct {
		svc *TenantService
	}

	CreateOrUpdateConnectorRequest struct {
		OrganizationID gid.GID
		Name           string
		Type           string
		Connection     connector.Connection
	}
)

func (s *ConnectorService) CreateOrUpdate(ctx context.Context, req CreateOrUpdateConnectorRequest) (*coredata.Connector, error) {
	if req.OrganizationID == gid.Nil {
		return nil, fmt.Errorf("organization ID is required")
	}

	if req.Name == "" {
		return nil, fmt.Errorf("connector name is required")
	}

	if req.Type == "" {
		return nil, fmt.Errorf("connector type is required")
	}

	if req.Connection == nil {
		return nil, fmt.Errorf("connection configuration is required")
	}

	connectorID, err := gid.NewGID(s.svc.scope.GetTenantID(), coredata.ConnectorEntityType)
	if err != nil {
		return nil, fmt.Errorf("cannot create connector global id: %w", err)
	}

	now := time.Now()

	connector := &coredata.Connector{
		ID:             connectorID,
		OrganizationID: req.OrganizationID,
		Name:           req.Name,
		Type:           req.Type,
		Connection:     req.Connection,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	err = s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			if err := connector.Upsert(ctx, conn, s.svc.scope); err != nil {
				return fmt.Errorf("cannot upsert connector: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return connector, nil
}
