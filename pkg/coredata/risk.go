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
	Risk struct {
		ID             gid.GID
		OrganizationID gid.GID
		Name           string
		Description    string
		Probability    float64
		Impact         float64
		CreatedAt      time.Time
		UpdatedAt      time.Time
	}

	Risks []*Risk
)

func (r *Risk) CursorKey(orderBy RiskOrderField) page.CursorKey {
	switch orderBy {
	case RiskOrderFieldCreatedAt:
		return page.CursorKey{ID: r.ID, Value: r.CreatedAt}
	}

	panic(fmt.Sprintf("unsupported order by: %s", orderBy))
}

func (r *Risks) LoadByMitigationID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	mitigationID gid.GID,
	cursor *page.Cursor[RiskOrderField],
) error {
	q := `
WITH rsks AS (
	SELECT
		r.id,
		r.organization_id,
		r.name,
		r.description,
		r.probability,
		r.impact,
		r.created_at,
		r.updated_at
	FROM
		risks r
	INNER JOIN
		risks_mitigations rm ON r.id = rm.risk_id
	WHERE
		rm.mitigation_id = @mitigation_id
)
SELECT
	id,
	organization_id,
	name,
	description,
	probability,
	impact,
	created_at,
	updated_at
FROM
	rsks
WHERE %s
	AND %s
`
	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.NamedArgs{"mitigation_id": mitigationID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query risks: %w", err)
	}

	risks, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[Risk])
	if err != nil {
		return fmt.Errorf("cannot collect risks: %w", err)
	}

	*r = risks

	return nil
}

func (r *Risks) LoadByOrganizationID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	organizationID gid.GID,
	cursor *page.Cursor[RiskOrderField],
) error {
	q := `
SELECT
	id,
	organization_id,
	name,
	description,
	probability,
	impact,
	created_at,
	updated_at
FROM risks
WHERE %s
	AND organization_id = @organization_id
	AND %s
`
	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.NamedArgs{"organization_id": organizationID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query risks: %w", err)
	}

	risks, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[Risk])
	if err != nil {
		return fmt.Errorf("cannot collect risks: %w", err)
	}

	*r = risks

	return nil
}

func (r *Risk) LoadByID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	riskID gid.GID,
) error {
	q := `
SELECT
	id,
	organization_id,
	name,
	description,
	probability,
	impact,
	created_at,
	updated_at
FROM risks
WHERE %s
	AND id = @id
LIMIT 1;
`
	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"id": riskID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query risk: %w", err)
	}

	risk, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[Risk])
	if err != nil {
		return fmt.Errorf("cannot collect risk: %w", err)
	}

	*r = risk

	return nil
}

func (r *Risk) Insert(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
INSERT INTO risks (id, tenant_id, organization_id, name, description, probability, impact, created_at, updated_at)
VALUES (@id, @tenant_id, @organization_id, @name, @description, @probability, @impact, @created_at, @updated_at)
`

	args := pgx.StrictNamedArgs{
		"id":              r.ID,
		"tenant_id":       scope.GetTenantID(),
		"organization_id": r.OrganizationID,
		"name":            r.Name,
		"description":     r.Description,
		"probability":     r.Probability,
		"impact":          r.Impact,
		"created_at":      r.CreatedAt,
		"updated_at":      r.UpdatedAt,
	}

	_, err := conn.Exec(ctx, q, args)
	return err
}

func (r *Risk) Update(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
UPDATE risks
SET
	name = @name,
	description = @description,
	probability = @probability,
	impact = @impact,
	updated_at = @updated_at
WHERE %s
	AND tenant_id = @tenant_id
`
	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{
		"name":        r.Name,
		"description": r.Description,
		"probability": r.Probability,
		"impact":      r.Impact,
		"updated_at":  r.UpdatedAt,
	}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	return err
}

func (r *Risk) Delete(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
DELETE FROM risks WHERE %s AND id = @id
`
	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{
		"id": r.ID,
	}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	return err
}
