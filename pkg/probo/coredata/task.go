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
	Task struct {
		ID          gid.GID
		ControlID   gid.GID
		Name        string
		Description string
		State       TaskState
		ContentRef  string
		CreatedAt   time.Time
		UpdatedAt   time.Time
	}

	Tasks []*Task
)

func (t Task) CursorKey() page.CursorKey {
	return page.NewCursorKey(uuid.UUID(t.ID), t.CreatedAt)
}

func (t *Task) scan(r pgx.Row) error {
	return r.Scan(
		&t.ID,
		&t.ControlID,
		&t.Name,
		&t.Description,
		&t.State,
		&t.ContentRef,
		&t.CreatedAt,
		&t.UpdatedAt,
	)
}

func (t *Tasks) LoadByControlID(
	ctx context.Context,
	conn pg.Conn,
	scope *Scope,
	controlID gid.GID,
	cursor *page.Cursor,
) error {
	q := `
WITH
    control_tasks AS (
        SELECT
            t.id,
            @control_id AS control_id,
            t.name,
            t.description,
            t.content_ref,
            t.created_at,
            t.updated_at
         FROM
             tasks t
         INNER JOIN
             controls_tasks ct ON
                 ct.task_id = t.id
                 AND ct.control_id = @control_id
         WHERE
             %s
    ),
    task_states AS (
        SELECT
            task_id,
            to_state AS state,
            reason,
            RANK() OVER w
        FROM
            task_state_transitions
        WINDOW
            w AS (PARTITION BY task_id ORDER BY created_at DESC)
    )
SELECT
    id,
    control_id,
    name,
    description,
    ts.state AS state,
    content_ref,
    created_at,
    updated_at
FROM
    control_tasks
INNER JOIN
    task_states ts ON ts.task_id = control_tasks.id
WHERE
    ts.rank = 1
    AND %s
`

	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.NamedArgs{"control_id": controlID}
	maps.Copy(args, scope.SQLArguments())
	maps.Copy(args, cursor.SQLArguments())

	r, err := conn.Query(ctx, q, args)
	if err != nil {
		return err
	}
	defer r.Close()

	tasks := Tasks{}
	for r.Next() {
		task := &Task{}
		if err := task.scan(r); err != nil {
			return err
		}

		tasks = append(tasks, task)
	}

	if err := r.Err(); err != nil {
		return err
	}

	*t = tasks

	return nil
}
