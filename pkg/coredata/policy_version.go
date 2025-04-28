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
	PolicyVersion struct {
		ID            gid.GID      `db:"id"`
		PolicyID      gid.GID      `db:"policy_id"`
		VersionNumber int          `db:"version_number"`
		Content       string       `db:"content"`
		Changelog     string       `db:"changelog"`
		CreatedBy     gid.GID      `db:"created_by"`
		Status        PolicyStatus `db:"status"`
		PublishedBy   *gid.GID     `db:"published_by"`
		PublishedAt   *time.Time   `db:"published_at"`
		CreatedAt     time.Time    `db:"created_at"`
		UpdatedAt     time.Time    `db:"updated_at"`
	}

	PolicyVersions []*PolicyVersion
)

func (p *PolicyVersions) LoadByPolicyID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	policyID gid.GID,
	cursor *page.Cursor[PolicyVersionOrderField],
) error {
	q := `
SELECT
	id,
	policy_id,
	version_number,
	content,
	changelog,
	created_by,
	status,
	published_by,
	published_at,
	created_at,
	updated_at
FROM
	policy_versions
WHERE
	%s
	AND policy_id = @policy_id
	AND %s
`

	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.StrictNamedArgs{"policy_id": policyID}
	maps.Copy(args, scope.SQLArguments())
	maps.Copy(args, cursor.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query policy versions: %w", err)
	}

	policyVersions, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[PolicyVersion])
	if err != nil {
		return fmt.Errorf("cannot collect policy versions: %w", err)
	}

	*p = policyVersions

	return nil
}

func (p PolicyVersion) CursorKey(orderBy PolicyVersionOrderField) page.CursorKey {
	switch orderBy {
	case PolicyVersionOrderFieldCreatedAt:
		return page.NewCursorKey(p.ID, p.CreatedAt)
	}

	panic(fmt.Sprintf("unsupported order by: %s", orderBy))
}

func (p *PolicyVersion) LoadByID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	policyVersionID gid.GID,
) error {
	q := `
SELECT
	id,
	policy_id,
	version_number,
	content,
	changelog,
	created_by,
	status,
	published_by,
	published_at,
	created_at,
	updated_at
FROM
	policy_versions
WHERE
	%s
	AND id = @policy_version_id
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"policy_version_id": policyVersionID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query policy versions: %w", err)
	}

	policyVersion, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[PolicyVersion])
	if err != nil {
		return fmt.Errorf("cannot collect policy version: %w", err)
	}

	*p = policyVersion

	return nil
}

func (p PolicyVersion) Insert(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
INSERT INTO policy_versions (
	tenant_id,
	id,
	policy_id, 
	version_number,
	content,
	changelog,
	created_by,
	status,
	created_at,
	updated_at
) VALUES (
	@tenant_id,
	@id,
	@policy_id,
	@version_number,
	@content,
	@changelog,
	@created_by,
	@status,
	@created_at,
	@updated_at
)
`

	now := time.Now()
	args := pgx.StrictNamedArgs{
		"tenant_id":      scope.GetTenantID(),
		"id":             p.ID,
		"policy_id":      p.PolicyID,
		"version_number": p.VersionNumber,
		"content":        p.Content,
		"changelog":      p.Changelog,
		"created_by":     p.CreatedBy,
		"status":         PolicyStatusDraft,
		"created_at":     now,
		"updated_at":     now,
	}

	_, err := conn.Exec(ctx, q, args)
	if err != nil {
		return fmt.Errorf("error creating/updating policy version: %w", err)
	}

	return nil
}

func (p *PolicyVersion) LoadByPolicyIDAndVersionNumber(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	policyID gid.GID,
	versionNumber int,
) error {
	q := `
SELECT
	id,
	policy_id,
	version_number,
	content,
	changelog,
	created_by,
	status,
	published_by,
	published_at,
	created_at,
	updated_at
FROM
	policy_versions
WHERE
	%s
	AND policy_id = @policy_id
	AND version_number = @version_number
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{
		"policy_id":      policyID,
		"version_number": versionNumber,
	}

	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query policy versions: %w", err)
	}

	policyVersion, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[PolicyVersion])
	if err != nil {
		return fmt.Errorf("cannot collect policy version: %w", err)
	}

	*p = policyVersion

	return nil
}

func (p *PolicyVersion) LoadLatestVersion(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	policyID gid.GID,
) error {
	q := `
SELECT
	id,
	policy_id,
	version_number,
	content,
	changelog,
	created_by,
	status,
	published_by,
	published_at,
	created_at,
	updated_at
FROM
	policy_versions
WHERE
	%s
	AND policy_id = @policy_id
ORDER BY created_at DESC
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{
		"policy_id": policyID,
	}

	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query policy versions: %w", err)
	}

	policyVersion, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[PolicyVersion])
	if err != nil {
		return fmt.Errorf("cannot collect policy version: %w", err)
	}

	*p = policyVersion

	return nil
}

func (p PolicyVersion) Update(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
UPDATE policy_versions SET
	changelog = @changelog,
	status = @status,	
	content = @content,
	published_by = @published_by,
	published_at = @published_at,
	updated_at = @updated_at
WHERE %s
	AND id = @policy_version_id;`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{
		"policy_version_id": p.ID,
		"changelog":         p.Changelog,
		"status":            p.Status,
		"content":           p.Content,
		"published_by":      p.PublishedBy,
		"published_at":      p.PublishedAt,
		"updated_at":        p.UpdatedAt,
	}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot update policy version: %w", err)
	}

	return nil
}
