package coredata

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
	"go.gearno.de/kit/pg"
)

type (
	Framework struct {
		ID             string
		OrganizationID string
		ContentID      string
		CreatedAt      time.Time
		UpdatedAt      time.Time
	}
)

func (f *Framework) scan(r pgx.Row) error {
	return r.Scan(
		&f.ID,
		&f.OrganizationID,
		&f.ContentID,
		&f.CreatedAt,
		&f.UpdatedAt,
	)
}

func (f *Framework) LoadByID(
	ctx context.Context,
	conn pg.Conn,
	frameworkID string,
) error {
	q := `
SELECT
    framework_id,
    organization_id,
    content_id,
    created_at,
    updated_at
FROM
    frameworks
WHERE
    framework_id = @framework_id
LIMIT 1;
`
	args := pgx.NamedArgs{"framework_id": frameworkID}
	r := conn.QueryRow(ctx, q, args)

	f2 := Framework{}
	if err := r.Scan(&f2); err != nil {
		return err
	}

	*f = f2

	return nil
}
