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

package coredata

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/getprobo/probo/pkg/connector"
	"github.com/getprobo/probo/pkg/gid"
	"github.com/jackc/pgx/v5"
	"go.gearno.de/kit/pg"
)

type (
	Connector struct {
		ID             gid.GID              `db:"id"`
		OrganizationID gid.GID              `db:"organization_id"`
		Name           string               `db:"name"`
		Type           string               `db:"type"`
		Connection     connector.Connection `db:"-"`
		RawConfig      json.RawMessage      `db:"connection"`
		CreatedAt      time.Time            `db:"created_at"`
		UpdatedAt      time.Time            `db:"updated_at"`
	}
)

func (c *Connector) Upsert(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
INSERT INTO
    connectors (
        id,
        tenant_id,
        organization_id,
        name,
        type,
        connection,
        created_at,
        updated_at
    )
VALUES (
    @id,
    @tenant_id,
    @organization_id,
    @name,
    @type,
    @connection,
    @created_at,
    @updated_at
)
ON CONFLICT (organization_id, name) DO UPDATE SET
    tenant_id = @tenant_id,
    organization_id = @organization_id,
    connection = @connection,
    updated_at = @updated_at
RETURNING
    id,
    organization_id,
    name,
    type,
    connection,
	created_at,
	updated_at
`

	rows, err := conn.Query(
		ctx,
		q,
		pgx.StrictNamedArgs{
			"id":              c.ID,
			"tenant_id":       scope.GetTenantID(),
			"organization_id": c.OrganizationID,
			"name":            c.Name,
			"type":            c.Type,
			"connection":      c.Connection,
			"created_at":      c.CreatedAt,
			"updated_at":      c.UpdatedAt,
		},
	)
	if err != nil {
		return err
	}
	defer rows.Close()

	cnnctr, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[Connector])
	if err != nil {
		return fmt.Errorf("cannot collect connectors: %w", err)
	}

	*c = cnnctr

	return nil
}
