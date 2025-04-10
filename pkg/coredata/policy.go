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
	Policy struct {
		ID             gid.GID      `db:"id"`
		OrganizationID gid.GID      `db:"organization_id"`
		OwnerID        gid.GID      `db:"owner_id"`
		Status         PolicyStatus `db:"status"`
		Name           string       `db:"name"`
		Content        string       `db:"content"`
		ReviewDate     *time.Time   `db:"review_date"`
		CreatedAt      time.Time    `db:"created_at"`
		UpdatedAt      time.Time    `db:"updated_at"`
	}

	Policies []*Policy
)

func (p Policy) CursorKey(orderBy PolicyOrderField) page.CursorKey {
	switch orderBy {
	case PolicyOrderFieldCreatedAt:
		return page.NewCursorKey(p.ID, p.CreatedAt)
	case PolicyOrderFieldName:
		return page.NewCursorKey(p.ID, p.Name)
	}

	panic(fmt.Sprintf("unsupported order by: %s", orderBy))
}

func (p *Policy) LoadByID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	policyID gid.GID,
) error {
	q := `
SELECT
    id,
    organization_id,
    owner_id,
    name,
	status,
    content,
    review_date,
    created_at,
    updated_at
FROM
    policies
WHERE
    %s
    AND id = @policy_id
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"policy_id": policyID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query policies: %w", err)
	}

	policy, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[Policy])
	if err != nil {
		return fmt.Errorf("cannot collect policy: %w", err)
	}

	*p = policy

	return nil
}

func (p *Policies) LoadByOrganizationID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	organizationID gid.GID,
	cursor *page.Cursor[PolicyOrderField],
) error {
	q := `
SELECT
    id,
    organization_id,
    owner_id,
    name,
	status,
    content,
    review_date,
    created_at,
    updated_at
FROM
    policies
WHERE
    %s
    AND organization_id = @organization_id
    AND %s
`

	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.StrictNamedArgs{"organization_id": organizationID}
	maps.Copy(args, scope.SQLArguments())
	maps.Copy(args, cursor.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query policies: %w", err)
	}

	policies, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[Policy])
	if err != nil {
		return fmt.Errorf("cannot collect policies: %w", err)
	}

	*p = policies

	return nil
}

func (p Policy) Insert(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
INSERT INTO
    policies (
        tenant_id,
        id,
        organization_id,
        owner_id,
        name,
		status,
        content,
        review_date,
        created_at,
        updated_at
    )
VALUES (
    @tenant_id,
    @policy_id,
    @organization_id,
    @owner_id,
    @name,
    @status,
    @content,
    @review_date,
    @created_at,
    @updated_at
);
`

	args := pgx.StrictNamedArgs{
		"tenant_id":       scope.GetTenantID(),
		"policy_id":       p.ID,
		"organization_id": p.OrganizationID,
		"owner_id":        p.OwnerID,
		"name":            p.Name,
		"status":          p.Status,
		"content":         p.Content,
		"review_date":     p.ReviewDate,
		"created_at":      p.CreatedAt,
		"updated_at":      p.UpdatedAt,
	}
	_, err := conn.Exec(ctx, q, args)
	return err
}

func (p Policy) Delete(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
DELETE FROM policies WHERE %s AND id = @policy_id
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"policy_id": p.ID}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	return err
}

func (p *Policy) Update(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
UPDATE
	policies
SET
	name = @name,
	status = @status,
	content = @content,
	review_date = @review_date,
	owner_id = @owner_id,
	updated_at = @updated_at
WHERE %s
    AND id = @policy_id
`
	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{
		"policy_id":   p.ID,
		"updated_at":  time.Now(),
		"name":        p.Name,
		"content":     p.Content,
		"status":      p.Status,
		"review_date": p.ReviewDate,
		"owner_id":    p.OwnerID,
	}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot update policy: %w", err)
	}

	return nil
}

func (p *Policies) LoadByControlID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	controlID gid.GID,
	cursor *page.Cursor[PolicyOrderField],
) error {
	q := `
WITH plcs AS (
	SELECT
		p.id,
		p.tenant_id,
		p.organization_id,
		p.owner_id,
		p.name,
		p.content,
		p.status,
		p.review_date,
		p.created_at,
		p.updated_at
	FROM
		policies p
	INNER JOIN
		controls_policies cp ON p.id = cp.policy_id
	WHERE
		cp.control_id = @control_id
)
SELECT
	id,
	organization_id,
	owner_id,
	name,
	content,
	status,
	review_date,
	created_at,
	updated_at
FROM
	plcs
WHERE %s
	AND %s
`
	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.StrictNamedArgs{"control_id": controlID}
	maps.Copy(args, scope.SQLArguments())
	maps.Copy(args, cursor.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query policies: %w", err)
	}

	policies, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[Policy])
	if err != nil {
		return fmt.Errorf("cannot collect policies: %w", err)
	}

	*p = policies

	return nil
}
