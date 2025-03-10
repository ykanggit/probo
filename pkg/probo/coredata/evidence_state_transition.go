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

	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/page"
	"github.com/jackc/pgx/v5"
	"go.gearno.de/kit/pg"
)

type (
	EvidenceStateTransition struct {
		StateTransition[EvidenceState]

		EvidenceID gid.GID `db:"evidence_id"`
	}

	EvidenceStateTransitions []*EvidenceStateTransition
)

func (cst EvidenceStateTransition) CursorKey() page.CursorKey {
	return page.NewCursorKey(cst.ID, cst.CreatedAt)
}

func (est EvidenceStateTransition) Insert(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
INSERT INTO
    evidence_state_transitions (
		tenant_id,
        id,
        evidence_id,
        from_state,
        to_state,
        reason,
        created_at,
        updated_at
    )
VALUES (
	@tenant_id,
    @evidence_state_transition_id,
    @evidence_id,
    @from_state,
    @to_state,
    @reason,
    @created_at,
    @updated_at
);
`

	args := pgx.StrictNamedArgs{
		"tenant_id":                    scope.GetTenantID(),
		"evidence_state_transition_id": est.ID,
		"evidence_id":                  est.EvidenceID,
		"from_state":                   est.FromState,
		"to_state":                     est.ToState,
		"reason":                       est.Reason,
		"created_at":                   est.CreatedAt,
		"updated_at":                   est.UpdatedAt,
	}
	_, err := conn.Exec(ctx, q, args)
	return err
}

func (cst *EvidenceStateTransitions) LoadByEvidenceID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	evidenceID gid.GID,
	cursor *page.Cursor,
) error {
	q := `
SELECT
    id,
    evidence_id,
    from_state,
    to_state,
    reason,
    created_at,
    updated_at
FROM
    evidence_state_transitions
WHERE
    %s
    AND evidence_id = @evidence_id
    AND %s
`

	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.StrictNamedArgs{"evidence_id": evidenceID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query evidence state transitions: %w", err)
	}

	evidenceStateTransitions, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[EvidenceStateTransition])
	if err != nil {
		return fmt.Errorf("cannot collect evidence state transitions: %w", err)
	}

	*cst = evidenceStateTransitions

	return nil
}

func (cst *EvidenceStateTransitions) DeleteForEvidenceID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	evidenceID gid.GID,
) error {
	q := `
DELETE FROM
    evidence_state_transitions
WHERE
    %s
    AND evidence_id = @evidence_id
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"evidence_id": evidenceID}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	return err
}
