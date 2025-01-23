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
	"github.com/getprobo/probo/pkg/probo/coredata/page"
	"github.com/jackc/pgx/v5"
	"go.gearno.de/crypto/uuid"
	"go.gearno.de/kit/pg"
)

type (
	Framework struct {
		ID             gid.GID
		OrganizationID string
		Name           string
		Description    string
		ContentRef     string
		CreatedAt      time.Time
		UpdatedAt      time.Time
	}

	Frameworks []*Framework
)

func (f Framework) CursorKey() page.CursorKey {
	return page.NewCursorKey(uuid.UUID(f.ID), f.CreatedAt)
}

func (f *Framework) scan(r pgx.Row) error {
	return r.Scan(
		&f.ID,
		&f.OrganizationID,
		&f.Name,
		&f.Description,
		&f.ContentRef,
		&f.CreatedAt,
		&f.UpdatedAt,
	)
}
func (f *Frameworks) LoadByOrganizationID(
	ctx context.Context,
	conn pg.Conn,
	scope *Scope,
	organizationID gid.GID,
	cursor *page.Cursor,
) error {
	q := `
SELECT
    id,
    organization_id,
    name,
    description,
    content_ref,
    created_at,
    updated_at
FROM
    frameworks
WHERE
    %s
    AND organization_id = @organization_id
    AND %s
`

	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.NamedArgs{"organization_id": organizationID}
	maps.Copy(args, cursor.SQLArguments())
	maps.Copy(args, cursor.SQLArguments())

	r, err := conn.Query(ctx, q, args)
	if err != nil {
		return err
	}
	defer r.Close()

	frameworks := Frameworks{}
	for r.Next() {
		framework := &Framework{}
		if err := framework.scan(r); err != nil {
			return err
		}

		frameworks = append(frameworks, framework)
	}

	if err := r.Err(); err != nil {
		return err
	}

	*f = frameworks

	return nil
}

func (f *Framework) LoadByID(
	ctx context.Context,
	conn pg.Conn,
	scope *Scope,
	frameworkID gid.GID,
) error {
	q := `
SELECT
    id,
    organization_id,
    name,
    description,
    content_ref,
    created_at,
    updated_at
FROM
    frameworks
WHERE
    %s
    AND framework_id = @framework_id
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.NamedArgs{"framework_id": frameworkID}
	maps.Copy(args, scope.SQLArguments())
	r := conn.QueryRow(ctx, q, args)

	f2 := Framework{}
	if err := r.Scan(&f2); err != nil {
		return err
	}

	*f = f2

	return nil
}
