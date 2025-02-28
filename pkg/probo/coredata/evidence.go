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
		ID        gid.GID
		TaskID    gid.GID
		State     EvidenceState
		ObjectKey string
		MimeType  string
		Size      uint64
		Filename  string
		CreatedAt time.Time
		UpdatedAt time.Time
	}

	Evidences []*Evidence
)

func (e Evidence) CursorKey() page.CursorKey {
	return page.NewCursorKey(e.ID, e.CreatedAt)
}

func (e *Evidence) scan(r pgx.Row) error {
	return r.Scan(
		&e.ID,
		&e.TaskID,
		&e.State,
		&e.ObjectKey,
		&e.MimeType,
		&e.Size,
		&e.Filename,
		&e.CreatedAt,
		&e.UpdatedAt,
	)
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

	r := conn.QueryRow(ctx, q, args)

	e2 := Evidence{}
	if err := e2.scan(r); err != nil {
		return err
	}

	*e = e2

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

	r, err := conn.Query(ctx, q, args)
	if err != nil {
		return err
	}
	defer r.Close()

	evidences := Evidences{}
	for r.Next() {
		evidence := &Evidence{}
		if err := evidence.scan(r); err != nil {
			return err
		}

		evidences = append(evidences, evidence)
	}

	if err := r.Err(); err != nil {
		return err
	}

	*e = evidences

	return nil
}
