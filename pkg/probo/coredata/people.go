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

	"github.com/getprobo/probo/pkg/probo/coredata/gid"
	"github.com/getprobo/probo/pkg/probo/coredata/page"
	"github.com/jackc/pgx/v5"
	"go.gearno.de/crypto/uuid"
	"go.gearno.de/kit/pg"
)

type (
	People struct {
		ID                       gid.GID
		OrganizationID           gid.GID
		FullName                 string
		PrimaryEmailAddress      string
		AdditionalEmailAddresses []string
		CreatedAt                time.Time
		UpdatedAt                time.Time
	}

	Peoples []*People
)

func (p People) CursorKey() page.CursorKey {
	return page.NewCursorKey(uuid.UUID(p.ID), p.CreatedAt)
}

func (p *People) scan(r pgx.Row) error {
	return r.Scan(
		&p.ID,
		&p.OrganizationID,
		&p.FullName,
		&p.PrimaryEmailAddress,
		&p.PrimaryEmailAddress,
		&p.CreatedAt,
		&p.UpdatedAt,
	)
}

func (p *Peoples) LoadByOrganizationID(
	ctx context.Context,
	conn pg.Conn,
	scope *Scope,
	organizationID gid.GID,
	cursor *page.Cursor,
) error {
	q := `
SELECT
    id,
    organization_id,
    full_name,
    primary_email_address,
    additional_email_addresses,
    created_at,
    updated_at
FROM
    peoples
WHERE
    %s
    AND organization_id = @organization_id
    AND %s
`

	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.NamedArgs{"organization_id": organizationID}
	maps.Copy(args, cursor.SQLArguments())
	maps.Copy(args, cursor.SQLArguments())

	r, err := conn.Query(ctx, q, args)
	if err != nil {
		return err
	}
	defer r.Close()

	peoples := Peoples{}
	for r.Next() {
		people := &People{}
		if err := people.scan(r); err != nil {
			return err
		}

		peoples = append(peoples, people)
	}

	if err := r.Err(); err != nil {
		return err
	}

	*p = peoples

	return nil
}
