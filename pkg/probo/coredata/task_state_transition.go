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

	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/page"
	"github.com/jackc/pgx/v5"
	"go.gearno.de/crypto/uuid"
	"go.gearno.de/kit/pg"
)

type (
	TaskStateTransition struct {
		TaskID gid.GID

		StateTransition[TaskState]
	}

	TaskStateTransitions []*TaskStateTransition
)

func (tst TaskStateTransition) CursorKey() page.CursorKey {
	return page.NewCursorKey(uuid.UUID(tst.ID), tst.CreatedAt)
}

func (tst *TaskStateTransition) scan(r pgx.Row) error {
	return r.Scan(
		&tst.ID,
		&tst.TaskID,
		&tst.FromState,
		&tst.ToState,
		&tst.Reason,
		&tst.CreatedAt,
		&tst.UpdatedAt,
	)
}

func (tst TaskStateTransition) Insert(
	ctx context.Context,
	conn pg.Conn,
) error {
	q := `
INSERT INTO
    task_state_transitions (
        id,
        control_id,
        from_state
        to_state,
        reason,
        created_at,
        updated_at
    )
VALUES (
    @task_state_transition_id,
    @task_id,
    @from_state,
    @to_state,
    @reason,
    @created_at,
    @updated_at
);
`

	args := pgx.NamedArgs{
		"task_state_transition_id": tst.ID,
		"task_id":                  tst.TaskID,
		"from_state":               tst.FromState,
		"to_state":                 tst.ToState,
		"reason":                   tst.Reason,
		"created_at":               tst.CreatedAt,
		"updated_at":               tst.UpdatedAt,
	}
	_, err := conn.Exec(ctx, q, args)
	return err
}

func (tst *TaskStateTransitions) LoadByTaskID(
	ctx context.Context,
	conn pg.Conn,
	scope *Scope,
	taskID gid.GID,
	cursor *page.Cursor,
) error {
	q := `
SELECT
    id,
    task_id,
    from_state,
    to_state,
    reason,
    created_at,
    updated_at
FROM
    task_state_transitions
WHERE
    %s
    AND task_id = @task_id
    AND %s
`

	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.NamedArgs{"task_id": taskID}
	maps.Copy(args, scope.SQLArguments())

	r, err := conn.Query(ctx, q, args)
	if err != nil {
		return err
	}
	defer r.Close()

	taskStateTransitions := TaskStateTransitions{}
	for r.Next() {
		taskStateTransition := &TaskStateTransition{}
		if err := taskStateTransition.scan(r); err != nil {
			return err
		}

		taskStateTransitions = append(taskStateTransitions, taskStateTransition)
	}

	if err := r.Err(); err != nil {
		return err
	}

	*tst = taskStateTransitions

	return nil
}
