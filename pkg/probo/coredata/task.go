package coredata

import (
	"context"
	"fmt"
	"maps"
	"time"

	"github.com/getprobo/probo/pkg/probo/coredata/page"
	"github.com/jackc/pgx/v5"
	"go.gearno.de/crypto/uuid"
	"go.gearno.de/kit/pg"
)

type (
	Task struct {
		ID         uuid.UUID
		ControlID  string
		ContentRef string
		CreatedAt  time.Time
		UpdatedAt  time.Time
	}

	Tasks []*Task
)

func (t Task) CursorKey() page.CursorKey {
	return page.NewCursorKey(t.ID, t.CreatedAt)
}

func (t *Task) scan(r pgx.Row) error {
	return r.Scan(
		&t.ID,
		&t.ControlID,
		&t.ContentRef,
		&t.CreatedAt,
		&t.UpdatedAt,
	)
}

func (t *Tasks) LoadByControlID(
	ctx context.Context,
	conn pg.Conn,
	controlID string,
	cursor *page.Cursor,
) error {
	q := `
SELECT
    id,
    control_id,
    content_ref,
    created_at,
    updated_at
FROM
    tasks
WHERE
    control_id = @control_id
    AND %s
`

	q = fmt.Sprintf(q, cursor.SQLFragment())

	args := pgx.NamedArgs{"control_id": controlID}
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
