package coredata

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
	"go.gearno.de/kit/pg"
)

type (
	Organization struct {
		ID        string
		Name      string
		CreatedAt time.Time
		UpdatedAt time.Time
	}
)

func (o *Organization) scan(r pgx.Row) error {
	return r.Scan(
		&o.ID,
		&o.Name,
		&o.CreatedAt,
		&o.UpdatedAt,
	)
}

func (o *Organization) LoadByID(
	ctx context.Context,
	conn pg.Conn,
	organizationID string,
) error {
	q := `
SELECT
    id,
    name,
    created_at,
    updated_at
FROM
    organizations
WHERE
    organization_id = @organization_id
LIMIT 1;
`

	args := pgx.NamedArgs{"organization_id": organizationID}
	r := conn.QueryRow(ctx, q, args)

	o2 := Organization{}
	if err := r.Scan(&o2); err != nil {
		return err
	}

	*o = o2

	return nil
}
