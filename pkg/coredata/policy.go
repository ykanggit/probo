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

	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/page"
	"github.com/jackc/pgx/v5"
	"go.gearno.de/kit/pg"
)

type (
	Policy struct {
		ID                      gid.GID   `db:"id"`
		OrganizationID          gid.GID   `db:"organization_id"`
		OwnerID                 gid.GID   `db:"owner_id"`
		Title                   string    `db:"title"`
		CurrentPublishedVersion *int      `db:"current_published_version"`
		CreatedAt               time.Time `db:"created_at"`
		UpdatedAt               time.Time `db:"updated_at"`
	}

	Policies []*Policy
)

func (p Policy) CursorKey(orderBy PolicyOrderField) page.CursorKey {
	switch orderBy {
	case PolicyOrderFieldCreatedAt:
		return page.NewCursorKey(p.ID, p.CreatedAt)
	case PolicyOrderFieldTitle:
		return page.NewCursorKey(p.ID, p.Title)
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
    title,
    current_published_version,
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
    title,
    current_published_version,
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
		title,
		current_published_version,
		created_at,
		updated_at
    )
VALUES (
    @tenant_id,
    @policy_id,
    @organization_id,
    @owner_id,
    @title,
    @current_published_version,
    @created_at,
    @updated_at
);
`

	args := pgx.StrictNamedArgs{
		"tenant_id":                 scope.GetTenantID(),
		"policy_id":                 p.ID,
		"organization_id":           p.OrganizationID,
		"owner_id":                  p.OwnerID,
		"title":                     p.Title,
		"current_published_version": p.CurrentPublishedVersion,
		"created_at":                p.CreatedAt,
		"updated_at":                p.UpdatedAt,
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
	title = @title,
	current_published_version = @current_published_version,
	owner_id = @owner_id,
	updated_at = @updated_at
WHERE %s
    AND id = @policy_id
`
	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{
		"policy_id":                 p.ID,
		"updated_at":                time.Now(),
		"title":                     p.Title,
		"current_published_version": p.CurrentPublishedVersion,
		"owner_id":                  p.OwnerID,
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
		p.title,
		p.current_published_version,
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
	title,
	current_published_version,
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

func (p *Policies) LoadByRiskID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	riskID gid.GID,
	cursor *page.Cursor[PolicyOrderField],
) error {
	q := `
WITH plcs AS (
	SELECT
		p.id,
		p.tenant_id,
		p.organization_id,
		p.owner_id,
		p.title,
		p.current_published_version,
		p.created_at,
		p.updated_at
	FROM
		policies p
	INNER JOIN
		risks_policies rp ON p.id = rp.policy_id
	WHERE
		rp.risk_id = @risk_id
)
SELECT
	id,
	organization_id,
	owner_id,
	title,
	current_published_version,
	created_at,
	updated_at
FROM
	plcs
WHERE %s
	AND %s
`
	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.StrictNamedArgs{"risk_id": riskID}
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
