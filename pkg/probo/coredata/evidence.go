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
	Evidence struct {
		ID        gid.GID       `db:"id"`
		TaskID    gid.GID       `db:"task_id"`
		State     EvidenceState `db:"state"`
		ObjectKey string        `db:"object_key"`
		MimeType  string        `db:"mime_type"`
		Size      uint64        `db:"size"`
		Filename  string        `db:"filename"`
		CreatedAt time.Time     `db:"created_at"`
		UpdatedAt time.Time     `db:"updated_at"`
	}

	Evidences []*Evidence
)

func (e Evidence) CursorKey() page.CursorKey {
	return page.NewCursorKey(e.ID, e.CreatedAt)
}

func (e Evidence) Insert(
	ctx context.Context,
	conn pg.Conn,
) error {
	q := `
INSERT INTO
    evidences (
        id,
        task_id,
        object_key,
        mime_type,
        size,
        filename,
        created_at,
        updated_at
    )
VALUES (
    @evidence_id,
    @task_id,
    @object_key,
    @mime_type,
    @size,
    @filename,
    @created_at,
    @updated_at
)
`

	args := pgx.NamedArgs{
		"evidence_id": e.ID,
		"task_id":     e.TaskID,
		"object_key":  e.ObjectKey,
		"mime_type":   e.MimeType,
		"size":        e.Size,
		"filename":    e.Filename,
		"created_at":  e.CreatedAt,
		"updated_at":  e.UpdatedAt,
	}
	_, err := conn.Exec(ctx, q, args)
	return err
}

func (e *Evidence) LoadByID(
	ctx context.Context,
	conn pg.Conn,
	scope *Scope,
	evidenceID gid.GID,
) error {
	q := `
WITH
    evidence_states AS (
        SELECT
            evidence_id,
            to_state AS state,
            reason,
            RANK() OVER w
        FROM
            evidence_state_transitions
        WHERE
            evidence_id = @evidence_id
        WINDOW
            w AS (PARTITION BY evidence_id ORDER BY created_at DESC)
    )
SELECT
    id,
    task_id,
    es.state,
    object_key,
    mime_type,
    size,
    filename,
    created_at,
    updated_at
FROM
    evidences
INNER JOIN
    evidence_states es ON es.evidence_id = evidences.id
WHERE
    %s
    AND id = @evidence_id
    AND es.rank = 1
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.NamedArgs{"evidence_id": evidenceID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query evidence: %w", err)
	}

	evidence, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[Evidence])
	if err != nil {
		return fmt.Errorf("cannot collect evidence: %w", err)
	}

	*e = evidence

	return nil
}

func (e *Evidences) LoadByTaskID(
	ctx context.Context,
	conn pg.Conn,
	scope *Scope,
	taskID gid.GID,
	cursor *page.Cursor,
) error {
	q := `
WITH
    evidence_states AS (
        SELECT
            evidence_id,
            to_state AS state,
            reason,
            RANK() OVER w
        FROM
            evidence_state_transitions
        WINDOW
            w AS (PARTITION BY evidence_id ORDER BY created_at DESC)
    )
SELECT
    id,
    task_id,
    es.state,
    object_key,
    mime_type,
    size,
    filename,
    created_at,
    updated_at
FROM
    evidences
INNER JOIN
    evidence_states es ON es.evidence_id = evidences.id
WHERE
    %s
    AND task_id = @task_id
    AND es.rank = 1
    AND %s
`

	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.NamedArgs{"task_id": taskID}
	maps.Copy(args, scope.SQLArguments())
	maps.Copy(args, cursor.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query evidence: %w", err)
	}

	evidences, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[Evidence])
	if err != nil {
		return fmt.Errorf("cannot collect evidence: %w", err)
	}

	*e = evidences

	return nil
}

func (e Evidence) Delete(
	ctx context.Context,
	conn pg.Conn,
	scope *Scope,
) error {
	q := `
DELETE FROM
    evidences
WHERE
	%s
    AND id = @evidence_id
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.NamedArgs{"evidence_id": e.ID}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	return err
}
