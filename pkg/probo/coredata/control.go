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
	Control struct {
		ID          gid.GID
		FrameworkID gid.GID
		Name        string
		Description string
		State       ControlState
		ContentRef  string
		CreatedAt   time.Time
		UpdatedAt   time.Time
	}

	Controls []*Control
)

func (c Control) CursorKey() page.CursorKey {
	return page.NewCursorKey(uuid.UUID(c.ID), c.CreatedAt)
}

func (c *Control) scan(r pgx.Row) error {
	return r.Scan(
		&c.ID,
		&c.FrameworkID,
		&c.Name,
		&c.Description,
		&c.State,
		&c.ContentRef,
		&c.CreatedAt,
		&c.UpdatedAt,
	)
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
    name,
    description,
    cs.to_state AS state,
    content_ref,
    created_at,
    updated_at
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

	r, err := conn.Query(ctx, q, args)
	if err != nil {
		return err
	}
	defer r.Close()

	controls := Controls{}
	for r.Next() {
		control := &Control{}
		if err := control.scan(r); err != nil {
			return err
		}

		controls = append(controls, control)
	}

	if err := r.Err(); err != nil {
		return err
	}

	*c = controls

	return nil
}
