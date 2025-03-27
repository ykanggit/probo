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
	"github.com/jackc/pgx/v5"
	"go.gearno.de/kit/pg"
)

type (
	ControlMitigation struct {
		ControlID    gid.GID      `db:"control_id"`
		MitigationID gid.GID      `db:"mitigation_id"`
		TenantID     gid.TenantID `db:"tenant_id"`
		CreatedAt    time.Time    `db:"created_at"`
	}

	ControlMitigations []*ControlMitigation
)

func (cm ControlMitigation) Insert(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
INSERT INTO
    control_mitigations (
        control_id,
        mitigation_id,
        tenant_id,
        created_at
    )
VALUES (
    @control_id,
    @mitigation_id,
    @tenant_id,
    @created_at
);
`

	args := pgx.StrictNamedArgs{
		"control_id":    cm.ControlID,
		"mitigation_id": cm.MitigationID,
		"tenant_id":     scope.GetTenantID(),
		"created_at":    cm.CreatedAt,
	}
	_, err := conn.Exec(ctx, q, args)
	return err
}

func (cm ControlMitigation) Delete(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
DELETE
FROM
    control_mitigations
WHERE
    %s
    AND control_id = @control_id
    AND mitigation_id = @mitigation_id;
`

	args := pgx.StrictNamedArgs{
		"control_id":    cm.ControlID,
		"mitigation_id": cm.MitigationID,
	}
	maps.Copy(args, scope.SQLArguments())
	q = fmt.Sprintf(q, scope.SQLFragment())

	_, err := conn.Exec(ctx, q, args)
	return err
}

func (cms *ControlMitigations) LoadByMitigationID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	mitigationID gid.GID,
) error {
	q := `
SELECT
    control_id,
    mitigation_id,
    tenant_id,
    created_at
FROM
    control_mitigations
WHERE
    %s
    AND mitigation_id = @mitigation_id
`
	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"mitigation_id": mitigationID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query control_mitigations: %w", err)
	}

	controlMitigations, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[ControlMitigation])
	if err != nil {
		return fmt.Errorf("cannot collect control_mitigations: %w", err)
	}

	*cms = controlMitigations
	return nil
}

func (cms *ControlMitigations) LoadByControlID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	controlID gid.GID,
) error {
	q := `
SELECT
    control_id,
    mitigation_id,
    tenant_id,
    created_at
FROM
    control_mitigations
WHERE
    %s
    AND control_id = @control_id
`
	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"control_id": controlID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query control_mitigations: %w", err)
	}

	controlMitigations, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[ControlMitigation])
	if err != nil {
		return fmt.Errorf("cannot collect control_mitigations: %w", err)
	}

	*cms = controlMitigations
	return nil
}
