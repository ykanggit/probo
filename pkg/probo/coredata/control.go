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
	scope *Scope,
	controlID gid.GID,
) error {
	q := `
WITH control_states AS (
    SELECT
        control_id,
        to_state,
        reason,
        RANK() OVER w
    FROM
        control_state_transitions
    WHERE
        control_id = @control_id
    WINDOW
        w AS (PARTITION BY control_id ORDER BY created_at DESC)
)
SELECT
    id,
    framework_id,
    category,
    name,
    description,
    cs.to_state AS state,
    content_ref,
    created_at,
    updated_at,
	version
FROM
    controls
INNER JOIN
    control_states cs ON cs.control_id = controls.id
WHERE
    %s
    AND id = @control_id
    AND cs.rank = 1
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.NamedArgs{"control_id": controlID}
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
) error {
	q := `
INSERT INTO
    controls (
        id,
        framework_id,
		category,
        name,
        description,
        content_ref,
        created_at,
        updated_at,
		version
    )
VALUES (
    @control_id,
    @framework_id,
	@category,
    @name,
    @description,
    @content_ref,
    @created_at,
    @updated_at,
    @version
);
`

	args := pgx.NamedArgs{
		"control_id":   c.ID,
		"framework_id": c.FrameworkID,
		"category":     c.Category,
		"name":         c.Name,
		"version":      0,
		"description":  c.Description,
		"content_ref":  c.ContentRef,
		"created_at":   c.CreatedAt,
		"updated_at":   c.UpdatedAt,
	}
	_, err := conn.Exec(ctx, q, args)
	return err
}

func (c *Controls) LoadByFrameworkID(
	ctx context.Context,
	conn pg.Conn,
	scope *Scope,
	frameworkID gid.GID,
	cursor *page.Cursor,
) error {
	q := `
WITH control_states AS (
    SELECT
        control_id,
        to_state,
        reason,
        RANK() OVER w
    FROM
        control_state_transitions
    WINDOW
        w AS (PARTITION BY control_id ORDER BY created_at DESC)
)
SELECT
    id,
    framework_id,
	category,
    name,
    description,
    cs.to_state AS state,
    content_ref,
    created_at,
    updated_at,
	version
FROM
    controls
INNER JOIN
    control_states cs ON cs.control_id = controls.id
WHERE
    %s
    AND framework_id = @framework_id
    AND cs.rank = 1
    AND %s
`
	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.NamedArgs{"framework_id": frameworkID}
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
	scope *Scope,
	params UpdateControlParams,
) error {
	q := `
WITH control_states AS (
    SELECT
        control_id,
        to_state,
        reason,
        RANK() OVER w
    FROM
        control_state_transitions
    WINDOW
        w AS (PARTITION BY control_id ORDER BY created_at DESC)
)
UPDATE controls SET
    name = COALESCE(@name, name),
    description = COALESCE(@description, description),
    category = COALESCE(@category, category),
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
	(SELECT to_state FROM control_states WHERE control_id = controls.id AND rank = 1) AS state,
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
