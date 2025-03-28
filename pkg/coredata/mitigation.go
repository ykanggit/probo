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
	"github.com/getprobo/probo/pkg/page"
	"github.com/jackc/pgx/v5"

	"go.gearno.de/kit/pg"
)

type (
	Mitigation struct {
		ID             gid.GID              `db:"id"`
		OrganizationID gid.GID              `db:"organization_id"`
		Category       string               `db:"category"`
		Name           string               `db:"name"`
		Description    string               `db:"description"`
		Importance     MitigationImportance `db:"importance"`
		State          MitigationState      `db:"state"`
		ContentRef     string               `db:"content_ref"`
		CreatedAt      time.Time            `db:"created_at"`
		UpdatedAt      time.Time            `db:"updated_at"`
		Version        int                  `db:"version"`
		Standards      []string             `db:"standards"`
	}

	Mitigations []*Mitigation
)

func (c Mitigation) CursorKey(orderBy MitigationOrderField) page.CursorKey {
	switch orderBy {
	case MitigationOrderFieldCreatedAt:
		return page.NewCursorKey(c.ID, c.CreatedAt)
	}

	panic(fmt.Sprintf("unsupported order by: %s", orderBy))
}

func (c *Mitigation) LoadByID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	mitigationID gid.GID,
) error {
	q := `
SELECT
    id,
    organization_id,
    category,
    name,
    description,
    state,
	importance,
    content_ref,
    created_at,
    updated_at,
	standards,
	version
FROM
    mitigations
WHERE
    %s
    AND id = @mitigation_id
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"mitigation_id": mitigationID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query mitigations: %w", err)
	}

	mitigation, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[Mitigation])
	if err != nil {
		return fmt.Errorf("cannot collect mitigations: %w", err)
	}

	*c = mitigation

	return nil
}

func (c Mitigation) Insert(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
INSERT INTO
    mitigations (
        tenant_id,
        id,
        organization_id,
		category,
        name,
		importance,
		state,
        description,
        content_ref,
        created_at,
        updated_at,
		standards,
		version
    )
VALUES (
    @tenant_id,
    @mitigation_id,
    @organization_id,
	@category,
    @name,
	@importance,
	@state,
    @description,
    @content_ref,
    @created_at,
    @updated_at,
	@standards,
    @version
);
`

	args := pgx.StrictNamedArgs{
		"tenant_id":       scope.GetTenantID(),
		"mitigation_id":   c.ID,
		"organization_id": c.OrganizationID,
		"category":        c.Category,
		"name":            c.Name,
		"version":         0,
		"description":     c.Description,
		"content_ref":     c.ContentRef,
		"created_at":      c.CreatedAt,
		"updated_at":      c.UpdatedAt,
		"state":           c.State,
		"importance":      c.Importance,
		"standards":       c.Standards,
	}
	_, err := conn.Exec(ctx, q, args)
	return err
}

func (c *Mitigations) LoadByOrganizationID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	organizationID gid.GID,
	cursor *page.Cursor[MitigationOrderField],
) error {
	q := `
SELECT
    id,
    organization_id,
	category,
    name,
    description,
    state,
	importance,
    content_ref,
    created_at,
    updated_at,
	standards,
	version
FROM
    mitigations
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
		return fmt.Errorf("cannot query mitigations: %w", err)
	}

	mitigations, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[Mitigation])
	if err != nil {
		return fmt.Errorf("cannot collect mitigations: %w", err)
	}

	*c = mitigations

	return nil
}

func (c *Mitigation) Update(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
UPDATE mitigations
SET
  name = @name,
  description = @description,
  category = @category,
  state = @state,
  importance = @importance,
  updated_at = @updated_at
WHERE %s
    AND id = @mitigation_id
`
	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.NamedArgs{
		"mitigation_id": c.ID,
		"name":          c.Name,
		"description":   c.Description,
		"category":      c.Category,
		"state":         c.State,
		"importance":    c.Importance,
		"updated_at":    c.UpdatedAt,
	}

	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	return err
}
