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
	"maps"
	"time"

	"github.com/getprobo/probo/pkg/connector"
	"github.com/getprobo/probo/pkg/crypto/cipher"
	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/page"
	"github.com/jackc/pgx/v5"
	"go.gearno.de/kit/pg"
)

type (
	Connector struct {
		ID                  gid.GID                `db:"id"`
		OrganizationID      gid.GID                `db:"organization_id"`
		Name                string                 `db:"name"`
		Type                connector.ProtocolType `db:"type"`
		Connection          connector.Connection   `db:"-"`
		EncryptedConnection []byte                 `db:"encrypted_connection"`
		CreatedAt           time.Time              `db:"created_at"`
		UpdatedAt           time.Time              `db:"updated_at"`
	}

	Connectors []*Connector
)

func (c *Connectors) LoadWithoutDecryptedConnectionByOrganizationID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	organizationID gid.GID,
	cursor *page.Cursor[ConnectorOrderField],
	encryptionKey cipher.EncryptionKey,
) error {
	q := `
SELECT
    id,
    organization_id,
    name,
    type,
    encrypted_connection,
	created_at,
	updated_at
FROM
    connectors
WHERE
	%s
    AND organization_id = @organization_id
	AND %s
`

	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.StrictNamedArgs{"organization_id": organizationID}
	maps.Copy(args, scope.SQLArguments())
	maps.Copy(args, cursor.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query connectors: %w", err)
	}

	connectors, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[Connector])
	if err != nil {
		return fmt.Errorf("cannot collect connectors: %w", err)
	}

	*c = connectors

	return nil
}

func (c *Connector) CursorKey(orderBy ConnectorOrderField) page.CursorKey {
	switch orderBy {
	case ConnectorOrderFieldCreatedAt:
		return page.CursorKey{ID: c.ID, Value: c.CreatedAt}
	}

	panic(fmt.Sprintf("unsupported order by: %s", orderBy))
}

func (c *Connector) Upsert(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	encryptionKey cipher.EncryptionKey,
) error {
	q := `
INSERT INTO
    connectors (
        id,
        tenant_id,
        organization_id,
        name,
        type,
        encrypted_connection,
        created_at,
        updated_at
    )
VALUES (
    @id,
    @tenant_id,
    @organization_id,
    @name,
    @type,
    @encrypted_connection,
    @created_at,
    @updated_at
)
ON CONFLICT (organization_id, name) DO UPDATE SET
    tenant_id = @tenant_id,
    organization_id = @organization_id,
    type = @type,
    encrypted_connection = @encrypted_connection,
    updated_at = @updated_at
RETURNING
    id,
    organization_id,
    name,
    type,
    encrypted_connection,
	created_at,
	updated_at
`

	if c.Connection == nil {
		return fmt.Errorf("connection is nil")
	}

	connection, err := json.Marshal(c.Connection)
	if err != nil {
		return fmt.Errorf("cannot marshal connection: %w", err)
	}

	encryptedConnection, err := cipher.Encrypt(connection, encryptionKey)
	if err != nil {
		return fmt.Errorf("cannot encrypt connection: %w", err)
	}

	rows, err := conn.Query(
		ctx,
		q,
		pgx.StrictNamedArgs{
			"id":                   c.ID,
			"tenant_id":            scope.GetTenantID(),
			"organization_id":      c.OrganizationID,
			"name":                 c.Name,
			"type":                 c.Type,
			"encrypted_connection": encryptedConnection,
			"created_at":           c.CreatedAt,
			"updated_at":           c.UpdatedAt,
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

	decryptedConnection, err := cipher.Decrypt(cnnctr.EncryptedConnection, encryptionKey)
	if err != nil {
		return fmt.Errorf("cannot decrypt connection: %w", err)
	}

	cnnctr.Connection, err = connector.UnmarshalConnection(cnnctr.Type, decryptedConnection)
	if err != nil {
		return fmt.Errorf("cannot unmarshal connection: %w", err)
	}

	*c = cnnctr

	return nil
}
