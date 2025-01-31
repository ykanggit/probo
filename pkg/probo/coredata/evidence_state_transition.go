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

	"github.com/getprobo/probo/pkg/probo/coredata/gid"
	"github.com/getprobo/probo/pkg/probo/coredata/page"
	"github.com/jackc/pgx/v5"
	"go.gearno.de/crypto/uuid"
	"go.gearno.de/kit/pg"
)

type (
	EvidenceStateTransition struct {
		StateTransition[EvidenceState]

		EvidenceID gid.GID
	}

	EvidenceStateTransitions []*EvidenceStateTransition
)

func (cst EvidenceStateTransition) CursorKey() page.CursorKey {
	return page.NewCursorKey(uuid.UUID(cst.ID), cst.CreatedAt)
}

func (cst *EvidenceStateTransition) scan(r pgx.Row) error {
	return r.Scan(
		&cst.ID,
		&cst.EvidenceID,
		&cst.FromState,
		&cst.ToState,
		&cst.Reason,
		&cst.CreatedAt,
		&cst.UpdatedAt,
	)
}

func (cst *EvidenceStateTransitions) LoadByEvidenceID(
	ctx context.Context,
	conn pg.Conn,
	scope *Scope,
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

	args := pgx.NamedArgs{"evidence_id": evidenceID}
	maps.Copy(args, scope.SQLArguments())

	r, err := conn.Query(ctx, q, args)
	if err != nil {
		return err
	}
	defer r.Close()

	evidenceStateTransitions := EvidenceStateTransitions{}
	for r.Next() {
		evidenceStateTransition := &EvidenceStateTransition{}
		if err := evidenceStateTransition.scan(r); err != nil {
			return err
		}

		evidenceStateTransitions = append(evidenceStateTransitions, evidenceStateTransition)
	}

	if err := r.Err(); err != nil {
		return err
	}

	*cst = evidenceStateTransitions

	return nil
}
