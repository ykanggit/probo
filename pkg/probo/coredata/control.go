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
	Control struct {
		ID          uuid.UUID
		FrameworkID string
		Name        string
		Description string
		ContentRef  string
		CreatedAt   time.Time
		UpdatedAt   time.Time
	}

	Controls []*Control
)

func (c *Control) CursorKey() page.CursorKey {
	return page.NewCursorKey(c.ID, c.CreatedAt)
}

func (c *Control) scan(r pgx.Row) error {
	return r.Scan(
		&c.ID,
		&c.FrameworkID,
		&c.Name,
		&c.Description,
		&c.ContentRef,
		&c.CreatedAt,
		&c.UpdatedAt,
	)
}

func (c *Controls) LoadByFrameworkID(
	ctx context.Context,
	conn pg.Conn,
	frameworkID string,
	cursor *page.Cursor,
) error {
	q := `
SELECT
    control_id,
    framework_id,
    name,
    description,
    content_ref,
    created_at,
    updated_at
FROM
    controls
WHERE
    framework_id = @framework_id
    AND %
`
	q = fmt.Sprintf(q, cursor.SQLFragment())

	args := pgx.NamedArgs{"framework_id": frameworkID}
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
