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

	"github.com/getprobo/probo/pkg/probo/coredata/gid"
	"github.com/jackc/pgx/v5"
	"go.gearno.de/kit/pg"
)

type (
	Organization struct {
		ID        gid.GID
		Name      string
		CreatedAt time.Time
		UpdatedAt time.Time
	}
)

func (o *Organization) scan(r pgx.Row) error {
	return r.Scan(
		&o.ID,
		&o.Name,
		&o.CreatedAt,
		&o.UpdatedAt,
	)
}

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

	args := pgx.NamedArgs{"organization_id": organizationID}
	maps.Copy(args, scope.SQLArguments())

	r := conn.QueryRow(ctx, q, args)

	o2 := Organization{}
	if err := o2.scan(r); err != nil {
		return err
	}

	*o = o2

	return nil
}
