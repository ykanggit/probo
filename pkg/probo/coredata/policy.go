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
		Status         PolicyStatus `db:"status"`
		Name           string       `db:"name"`
		Content        string       `db:"content"`
		ReviewDate     *time.Time   `db:"review_date"`
		CreatedAt      time.Time    `db:"created_at"`
		UpdatedAt      time.Time    `db:"updated_at"`
		Version        int          `db:"version"`
	}

	Policies []*Policy

	UpdatePolicyParams struct {
		ExpectedVersion int
		Name            *string
		Content         *string
		Status          *PolicyStatus
		ReviewDate      **time.Time
	}
)

func (p Policy) CursorKey() page.CursorKey {
	return page.NewCursorKey(p.ID, p.CreatedAt)
}

func (p *Policy) LoadByID(
	ctx context.Context,
	conn pg.Conn,
	scope *Scope,
	policyID gid.GID,
) error {
	q := `
SELECT
    id,
    organization_id,
    name,
	status,
    content,
    review_date,
    created_at,
    updated_at,
    version
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
	scope *Scope,
	organizationID gid.GID,
	cursor *page.Cursor,
) error {
	q := `
SELECT
    id,
    organization_id,
    name,
	status,
    content,
    review_date,
    created_at,
    updated_at,
    version
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
) error {
	q := `
INSERT INTO
    policies (
        id,
        organization_id,
        name,
		status,
        content,
        review_date,
        created_at,
        updated_at,
        version
    )
VALUES (
    @policy_id,
    @organization_id,
    @name,
    @status,
    @content,
    @review_date,
    @created_at,
    @updated_at,
    @version
);
`

	args := pgx.StrictNamedArgs{
		"policy_id":       p.ID,
		"organization_id": p.OrganizationID,
		"name":            p.Name,
		"status":          p.Status,
		"content":         p.Content,
		"review_date":     p.ReviewDate,
		"created_at":      p.CreatedAt,
		"updated_at":      p.UpdatedAt,
		"version":         p.Version,
	}
	_, err := conn.Exec(ctx, q, args)
	return err
}

func (p Policy) Delete(
	ctx context.Context,
	conn pg.Conn,
	scope *Scope,
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
	scope *Scope,
	params UpdatePolicyParams,
) error {
	q := `
UPDATE policies SET
    name = COALESCE(@name, name),
    status = COALESCE(@status, status),
    content = COALESCE(@content, content),
    review_date = COALESCE(@review_date, review_date),
    updated_at = @updated_at,
    version = version + 1
WHERE %s
    AND id = @policy_id
    AND version = @expected_version
RETURNING 
    id,
    organization_id,
    name,
    content,
    review_date,
    created_at,
    updated_at,
	status,
    version
`
	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{
		"policy_id":        p.ID,
		"expected_version": params.ExpectedVersion,
		"updated_at":       time.Now(),
	}

	if params.Name != nil {
		args["name"] = *params.Name
	}
	if params.Content != nil {
		args["content"] = *params.Content
	}
	if params.Status != nil {
		args["status"] = *params.Status
	}
	if params.ReviewDate != nil {
		args["review_date"] = *params.ReviewDate
	}

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
