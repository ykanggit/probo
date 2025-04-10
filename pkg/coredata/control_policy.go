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
	ControlPolicy struct {
		ControlID gid.GID      `db:"control_id"`
		PolicyID  gid.GID      `db:"policy_id"`
		TenantID  gid.TenantID `db:"tenant_id"`
		CreatedAt time.Time    `db:"created_at"`
	}

	ControlPolicies []*ControlPolicy
)

func (cp ControlPolicy) Insert(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
INSERT INTO
    controls_policies (
        control_id,
        policy_id,
        tenant_id,
        created_at
    )
VALUES (
    @control_id,
    @policy_id,
    @tenant_id,
    @created_at
);
`

	args := pgx.StrictNamedArgs{
		"control_id": cp.ControlID,
		"policy_id":  cp.PolicyID,
		"tenant_id":  scope.GetTenantID(),
		"created_at": cp.CreatedAt,
	}
	_, err := conn.Exec(ctx, q, args)
	return err
}

func (cp ControlPolicy) Delete(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
DELETE
FROM
    controls_policies
WHERE
    %s
    AND control_id = @control_id
    AND policy_id = @policy_id;
`

	args := pgx.StrictNamedArgs{
		"control_id": cp.ControlID,
		"policy_id":  cp.PolicyID,
	}
	maps.Copy(args, scope.SQLArguments())

	q = fmt.Sprintf(q, scope.SQLFragment())

	_, err := conn.Exec(ctx, q, args)
	return err
}
