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
	Framework struct {
		ID             uuid.UUID
		OrganizationID string
		Name           string
		Description    string
		ContentRef     string
		CreatedAt      time.Time
		UpdatedAt      time.Time
	}

	Frameworks []*Framework
)

func (f Framework) CursorKey() page.CursorKey {
	return page.NewCursorKey(f.ID, f.CreatedAt)
}

func (f *Framework) scan(r pgx.Row) error {
	return r.Scan(
		&f.ID,
		&f.OrganizationID,
		&f.Name,
		&f.Description,
		&f.ContentRef,
		&f.CreatedAt,
		&f.UpdatedAt,
	)
}
func (f *Frameworks) LoadByOrganizationID(
	ctx context.Context,
	conn pg.Conn,
	organizationID string,
	cursor *page.Cursor,
) error {
	q := `
SELECT
    framework_id,
    organization_id,
    name,
    description,
    content_ref,
    created_at,
    updated_at
FROM
    frameworks
WHERE
    organization_id = @organization_id
    AND %
`

	q = fmt.Sprintf(q, cursor.SQLFragment())

	args := pgx.NamedArgs{"organization_id": organizationID}
	maps.Copy(args, cursor.SQLArguments())

	r, err := conn.Query(ctx, q, args)
	if err != nil {
		return err
	}
	defer r.Close()

	frameworks := Frameworks{}
	for r.Next() {
		framework := &Framework{}
		if err := framework.scan(r); err != nil {
			return err
		}

		frameworks = append(frameworks, framework)
	}

	if err := r.Err(); err != nil {
		return err
	}

	*f = frameworks

	return nil
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
    name,
    description,
    content_ref,
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
