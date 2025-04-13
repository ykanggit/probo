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
	ControlMesure struct {
		ControlID gid.GID      `db:"control_id"`
		MesureID  gid.GID      `db:"mesure_id"`
		TenantID  gid.TenantID `db:"tenant_id"`
		CreatedAt time.Time    `db:"created_at"`
	}

	ControlMesures []*ControlMesure
)

func (cm ControlMesure) Upsert(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
INSERT INTO
    controls_mesures (
        control_id,
        mesure_id,
        tenant_id,
        created_at
    )
VALUES (
    @control_id,
    @mesure_id,
    @tenant_id,
    @created_at
)
ON CONFLICT (control_id, mesure_id) DO NOTHING;
`

	args := pgx.StrictNamedArgs{
		"control_id": cm.ControlID,
		"mesure_id":  cm.MesureID,
		"tenant_id":  scope.GetTenantID(),
		"created_at": cm.CreatedAt,
	}
	_, err := conn.Exec(ctx, q, args)
	return err
}

func (cm ControlMesure) Insert(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
INSERT INTO
    controls_mesures (
        control_id,
        mesure_id,
        tenant_id,
        created_at
    )
VALUES (
    @control_id,
    @mesure_id,
    @tenant_id,
    @created_at
);
`

	args := pgx.StrictNamedArgs{
		"control_id": cm.ControlID,
		"mesure_id":  cm.MesureID,
		"tenant_id":  scope.GetTenantID(),
		"created_at": cm.CreatedAt,
	}
	_, err := conn.Exec(ctx, q, args)
	return err
}

func (cm ControlMesure) Delete(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
DELETE
FROM
    controls_mesures
WHERE
    %s
    AND control_id = @control_id
    AND mesure_id = @mesure_id;
`

	args := pgx.StrictNamedArgs{
		"control_id": cm.ControlID,
		"mesure_id":  cm.MesureID,
	}
	maps.Copy(args, scope.SQLArguments())
	q = fmt.Sprintf(q, scope.SQLFragment())

	_, err := conn.Exec(ctx, q, args)
	return err
}

func (cms *ControlMesures) LoadByMesureID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	mesureID gid.GID,
) error {
	q := `
SELECT
    control_id,
    mesure_id,
    tenant_id,
    created_at
FROM
    controls_mesures
WHERE
    %s
    AND mesure_id = @mesure_id
`
	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"mesure_id": mesureID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query control_mesures: %w", err)
	}

	controlMesures, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[ControlMesure])
	if err != nil {
		return fmt.Errorf("cannot collect control_mesures: %w", err)
	}

	*cms = controlMesures
	return nil
}
