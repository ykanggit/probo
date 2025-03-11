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
	Control struct {
		ID          gid.GID      `db:"id"`
		FrameworkID gid.GID      `db:"framework_id"`
		Category    string       `db:"category"`
		Name        string       `db:"name"`
		Description string       `db:"description"`
		State       ControlState `db:"state"`
		ContentRef  string       `db:"content_ref"`
		CreatedAt   time.Time    `db:"created_at"`
		UpdatedAt   time.Time    `db:"updated_at"`
		Version     int          `db:"version"`
	}

	Controls []*Control

	UpdateControlParams struct {
		ExpectedVersion int
		Name            *string
		Description     *string
		Category        *string
		State           *ControlState
	}
)

func (c Control) CursorKey() page.CursorKey {
	return page.NewCursorKey(c.ID, c.CreatedAt)
}

func (c *Control) LoadByID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	controlID gid.GID,
) error {
	q := `
SELECT
    id,
    framework_id,
    category,
    name,
    description,
    state,
    content_ref,
    created_at,
    updated_at,
	version
FROM
    controls
WHERE
    %s
    AND id = @control_id
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"control_id": controlID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query controls: %w", err)
	}

	control, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[Control])
	if err != nil {
		return fmt.Errorf("cannot collect controls: %w", err)
	}

	*c = control

	return nil
}

func (c Control) Insert(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
INSERT INTO
    controls (
        tenant_id,
        id,
        framework_id,
		category,
        name,
		state,
        description,
        content_ref,
        created_at,
        updated_at,
		version
    )
VALUES (
    @tenant_id,
    @control_id,
    @framework_id,
	@category,
    @name,
	@state,
    @description,
    @content_ref,
    @created_at,
    @updated_at,
    @version
);
`

	args := pgx.StrictNamedArgs{
		"tenant_id":    scope.GetTenantID(),
		"control_id":   c.ID,
		"framework_id": c.FrameworkID,
		"category":     c.Category,
		"name":         c.Name,
		"version":      0,
		"description":  c.Description,
		"content_ref":  c.ContentRef,
		"created_at":   c.CreatedAt,
		"updated_at":   c.UpdatedAt,
		"state":        c.State,
	}
	_, err := conn.Exec(ctx, q, args)
	return err
}

func (c *Controls) LoadByFrameworkID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	frameworkID gid.GID,
	cursor *page.Cursor,
) error {
	q := `
SELECT
    id,
    framework_id,
	category,
    name,
    description,
    state,
    content_ref,
    created_at,
    updated_at,
	version
FROM
    controls
WHERE
    %s
    AND framework_id = @framework_id
    AND %s
`
	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.StrictNamedArgs{"framework_id": frameworkID}
	maps.Copy(args, scope.SQLArguments())
	maps.Copy(args, cursor.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query controls: %w", err)
	}

	controls, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[Control])
	if err != nil {
		return fmt.Errorf("cannot collect controls: %w", err)
	}

	*c = controls

	return nil
}

func (c *Control) Update(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	params UpdateControlParams,
) error {
	q := `
UPDATE controls SET
    name = COALESCE(@name, name),
    description = COALESCE(@description, description),
    category = COALESCE(@category, category),
	state = COALESCE(@state, state),
    updated_at = @updated_at,
    version = version + 1
WHERE %s
    AND id = @control_id
    AND version = @expected_version
RETURNING 
    id,
    framework_id,
    category,
    name,
    description,
	state,
    content_ref,
    created_at,
    updated_at,
    version
`
	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.NamedArgs{
		"control_id":       c.ID,
		"expected_version": params.ExpectedVersion,
		"updated_at":       time.Now(),
	}

	maps.Copy(args, scope.SQLArguments())

	if params.Name != nil {
		args["name"] = *params.Name
	}
	if params.Description != nil {
		args["description"] = *params.Description
	}
	if params.Category != nil {
		args["category"] = *params.Category
	}

	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query controls: %w", err)
	}

	control, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[Control])
	if err != nil {
		return fmt.Errorf("cannot collect controls: %w", err)
	}

	*c = control

	return nil
}
