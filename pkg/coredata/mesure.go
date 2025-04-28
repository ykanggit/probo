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
	Mesure struct {
		ID             gid.GID      `db:"id"`
		TenantID       gid.TenantID `db:"tenant_id"`
		OrganizationID gid.GID      `db:"organization_id"`
		Category       string       `db:"category"`
		Name           string       `db:"name"`
		Description    string       `db:"description"`
		State          MesureState  `db:"state"`
		ReferenceID    string       `db:"reference_id"`
		CreatedAt      time.Time    `db:"created_at"`
		UpdatedAt      time.Time    `db:"updated_at"`
	}

	Mesures []*Mesure
)

func (m Mesure) CursorKey(orderBy MesureOrderField) page.CursorKey {
	switch orderBy {
	case MesureOrderFieldCreatedAt:
		return page.NewCursorKey(m.ID, m.CreatedAt)
	}

	panic(fmt.Sprintf("unsupported order by: %s", orderBy))
}

func (m *Mesures) LoadByRiskID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	riskID gid.GID,
	cursor *page.Cursor[MesureOrderField],
) error {
	q := `
WITH msrs AS (
	SELECT
		m.id,
		m.tenant_id,
		m.organization_id,
		m.category,
		m.name,
		m.description,
		m.state,
		m.reference_id,
		m.created_at,
		m.updated_at
	FROM
		mesures m
	INNER JOIN
		risks_mesures rm ON m.id = rm.mesure_id
	WHERE
		rm.risk_id = @risk_id
)
SELECT
	id,
	tenant_id,
	organization_id,
	category,
	name,
	description,
	state,
	reference_id,
	created_at,
	updated_at
FROM
	msrs
WHERE %s
	AND %s
`
	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.StrictNamedArgs{"risk_id": riskID}
	maps.Copy(args, scope.SQLArguments())
	maps.Copy(args, cursor.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query mesures: %w", err)
	}

	mesures, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[Mesure])
	if err != nil {
		return fmt.Errorf("cannot collect mesures: %w", err)
	}

	*m = mesures

	return nil
}

func (m *Mesures) LoadByControlID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	controlID gid.GID,
	cursor *page.Cursor[MesureOrderField],
) error {
	q := `
WITH mtgtns AS (
	SELECT
		m.id,
		m.tenant_id,
		m.organization_id,
		m.category,
		m.name,
		m.description,
		m.state,
		m.reference_id,
		m.created_at,
		m.updated_at
	FROM
		mesures m
	INNER JOIN
		controls_mesures cm ON m.id = cm.mesure_id
	WHERE
		cm.control_id = @control_id
)
SELECT
	id,
	tenant_id,
	organization_id,
	category,
	name,
	description,
	state,
	reference_id,
	created_at,
	updated_at
FROM
	mtgtns
WHERE %s
	AND %s
`
	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.StrictNamedArgs{"control_id": controlID}
	maps.Copy(args, scope.SQLArguments())
	maps.Copy(args, cursor.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query mesures: %w", err)
	}

	mesures, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[Mesure])
	if err != nil {
		return fmt.Errorf("cannot collect mesures: %w", err)
	}

	*m = mesures

	return nil
}

func (m *Mesures) LoadByOrganizationID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	organizationID gid.GID,
	cursor *page.Cursor[MesureOrderField],
) error {
	q := `
SELECT
    id,
	tenant_id,
    organization_id,
	category,
    name,
    description,
    state,
    reference_id,
    created_at,
    updated_at
FROM
    mesures
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
		return fmt.Errorf("cannot query mesures: %w", err)
	}

	mesures, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[Mesure])
	if err != nil {
		return fmt.Errorf("cannot collect mesures: %w", err)
	}

	*m = mesures

	return nil
}

func (m *Mesure) LoadByID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	mesureID gid.GID,
) error {
	q := `
SELECT
    id,
	tenant_id,
    organization_id,
    category,
    name,
    description,
    state,
    reference_id,
    created_at,
    updated_at
FROM
    mesures
WHERE
    %s
    AND id = @mesure_id
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"mesure_id": mesureID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query mesures: %w", err)
	}

	mesure, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[Mesure])
	if err != nil {
		return fmt.Errorf("cannot collect mesures: %w", err)
	}

	*m = mesure

	return nil
}

func (m *Mesure) Upsert(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
INSERT INTO
    mesures (
        tenant_id,
        id,
        organization_id,
		category,
        name,
		state,
        description,
        reference_id,
        created_at,
        updated_at
	)
VALUES (
    @tenant_id,
    @mesure_id,
    @organization_id,
	@category,
    @name,
	@state,
    @description,
    @reference_id,
    @created_at,
    @updated_at
)
ON CONFLICT (organization_id, reference_id) DO UPDATE SET
    name = @name,
    description = @description,
    category = @category,
    updated_at = @updated_at
RETURNING
	tenant_id,
    id,
    organization_id,
	category,
    name,
	importance,
	state,
    description,
	reference_id,
    created_at,
    updated_at
`

	args := pgx.StrictNamedArgs{
		"tenant_id":       scope.GetTenantID(),
		"mesure_id":       m.ID,
		"organization_id": m.OrganizationID,
		"category":        m.Category,
		"name":            m.Name,
		"state":           m.State,
		"description":     m.Description,
		"reference_id":    m.ReferenceID,
		"created_at":      m.CreatedAt,
		"updated_at":      m.UpdatedAt,
	}

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query mesures: %w", err)
	}

	mesure, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[Mesure])
	if err != nil {
		return fmt.Errorf("cannot collect mesures: %w", err)
	}

	*m = mesure

	return nil
}

func (m Mesure) Insert(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
INSERT INTO
    mesures (
        tenant_id,
        id,
        organization_id,
		category,
        name,
		state,
        description,
        reference_id,
        created_at,
        updated_at
    )
VALUES (
    @tenant_id,
    @mesure_id,
    @organization_id,
	@category,
    @name,
	@state,
    @description,
    @reference_id,
    @created_at,
    @updated_at
);
`

	args := pgx.StrictNamedArgs{
		"tenant_id":       scope.GetTenantID(),
		"mesure_id":       m.ID,
		"organization_id": m.OrganizationID,
		"category":        m.Category,
		"name":            m.Name,
		"description":     m.Description,
		"reference_id":    m.ReferenceID,
		"created_at":      m.CreatedAt,
		"updated_at":      m.UpdatedAt,
		"state":           m.State,
	}
	_, err := conn.Exec(ctx, q, args)
	return err
}

func (m *Mesure) Update(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
UPDATE mesures
SET
  name = @name,
  description = @description,
  category = @category,
  state = @state,
  updated_at = @updated_at
WHERE %s
    AND id = @mesure_id
`
	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.NamedArgs{
		"mesure_id":   m.ID,
		"name":        m.Name,
		"description": m.Description,
		"category":    m.Category,
		"state":       m.State,
		"updated_at":  m.UpdatedAt,
	}

	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	return err
}
