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
	"go.gearno.de/crypto/uuid"
	"go.gearno.de/kit/pg"
)

type (
	ControlStateTransition struct {
		StateTransition[ControlState]

		ControlID gid.GID
	}

	ControlStateTransitions []*ControlStateTransition
)

func (cst ControlStateTransition) CursorKey() page.CursorKey {
	return page.NewCursorKey(uuid.UUID(cst.ID), cst.CreatedAt)
}

func (cst *ControlStateTransition) scan(r pgx.Row) error {
	return r.Scan(
		&cst.ID,
		&cst.ControlID,
		&cst.FromState,
		&cst.ToState,
		&cst.Reason,
		&cst.CreatedAt,
		&cst.UpdatedAt,
	)
}

func (cst ControlStateTransition) Insert(
	ctx context.Context,
	conn pg.Conn,
) error {
	q := `
INSERT INTO
    control_state_transitions (
        id,
        control_id,
        from_state
        to_state,
        reason,
        created_at,
        updated_at
    )
VALUES (
    @control_state_transition_id,
    @control_id,
    @from_state,
    @to_state,
    @reason,
    @created_at,
    @updated_at
);
`

	args := pgx.NamedArgs{
		"control_state_transition_id": cst.ID,
		"control_id":                  cst.ControlID,
		"from_state":                  cst.FromState,
		"to_state":                    cst.ToState,
		"reason":                      cst.Reason,
		"created_at":                  cst.CreatedAt,
		"updated_at":                  cst.UpdatedAt,
	}
	_, err := conn.Exec(ctx, q, args)
	return err
}

func (cst *ControlStateTransitions) LoadByControlID(
	ctx context.Context,
	conn pg.Conn,
	scope *Scope,
	controlID gid.GID,
	cursor *page.Cursor,
) error {
	q := `
SELECT
    id,
    control_id,
    from_state,
    to_state,
    reason,
    created_at,
    updated_at
FROM
    control_state_transitions
WHERE
    %s
    AND control_id = @control_id
    AND %s
`

	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.NamedArgs{"control_id": controlID}
	maps.Copy(args, scope.SQLArguments())

	r, err := conn.Query(ctx, q, args)
	if err != nil {
		return err
	}
	defer r.Close()

	controlStateTransitions := ControlStateTransitions{}
	for r.Next() {
		controlStateTransition := &ControlStateTransition{}
		if err := controlStateTransition.scan(r); err != nil {
			return err
		}

		controlStateTransitions = append(controlStateTransitions, controlStateTransition)
	}

	if err := r.Err(); err != nil {
		return err
	}

	*cst = controlStateTransitions

	return nil
}
