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
	RiskPolicy struct {
		RiskID    gid.GID      `db:"risk_id"`
		PolicyID  gid.GID      `db:"policy_id"`
		TenantID  gid.TenantID `db:"tenant_id"`
		CreatedAt time.Time    `db:"created_at"`
	}

	RiskPolicies []*RiskPolicy
)

func (rp RiskPolicy) Insert(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
INSERT INTO
    risks_policies (
        risk_id,
        policy_id,
        tenant_id,
        created_at
    )
VALUES (
    @risk_id,
    @policy_id,
    @tenant_id,
    @created_at
);
`

	args := pgx.StrictNamedArgs{
		"risk_id":    rp.RiskID,
		"policy_id":  rp.PolicyID,
		"tenant_id":  scope.GetTenantID(),
		"created_at": rp.CreatedAt,
	}
	_, err := conn.Exec(ctx, q, args)
	return err
}

func (rp RiskPolicy) Delete(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
DELETE
FROM
    risks_policies
WHERE
    %s
    AND risk_id = @risk_id
    AND policy_id = @policy_id;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{
		"risk_id":   rp.RiskID,
		"policy_id": rp.PolicyID,
	}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	return err
}
