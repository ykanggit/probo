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
	"fmt"
	"maps"
	"time"

	"github.com/getprobo/probo/pkg/gid"
	"github.com/jackc/pgx/v5"
	"go.gearno.de/kit/pg"
)

type (
	Organization struct {
		ID        gid.GID   `db:"id"`
		Name      string    `db:"name"`
		LogoURL   string    `db:"logo_url"`
		CreatedAt time.Time `db:"created_at"`
		UpdatedAt time.Time `db:"updated_at"`
	}
)

func (o *Organization) LoadByID(
	ctx context.Context,
	conn pg.Conn,
	scope *Scope,
	organizationID gid.GID,
) error {
	q := `
SELECT
    id,
    name,
    logo_url,
    created_at,
    updated_at
FROM
    organizations
WHERE
    %s
    AND id = @organization_id
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"organization_id": organizationID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query organizations: %w", err)
	}

	organization, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[Organization])
	if err != nil {
		return fmt.Errorf("cannot collect organization: %w", err)
	}

	*o = organization

	return nil
}

func (o *Organization) Insert(
	ctx context.Context,
	conn pg.Conn,
) error {
	q := `
INSERT INTO organizations (
    id,
    name,
    logo_url,
    created_at,
    updated_at
) VALUES (@id, @name, @logo_url, @created_at, @updated_at)
`

	args := pgx.StrictNamedArgs{
		"id":         o.ID,
		"name":       o.Name,
		"logo_url":   o.LogoURL,
		"created_at": o.CreatedAt,
		"updated_at": o.UpdatedAt,
	}

	_, err := conn.Exec(ctx, q, args)
	if err != nil {
		return err
	}

	return nil
}
