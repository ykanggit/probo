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
	"errors"
	"fmt"
	"maps"
	"time"

	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/page"
	"github.com/jackc/pgx/v5"
	"go.gearno.de/kit/pg"
)

type (
	People struct {
		ID                       gid.GID
		OrganizationID           gid.GID
		Kind                     PeopleKind
		FullName                 string
		PrimaryEmailAddress      string
		AdditionalEmailAddresses []string
		CreatedAt                time.Time
		UpdatedAt                time.Time
		Version                  int
	}

	Peoples []*People

	UpdatePeopleParams struct {
		ExpectedVersion          int
		FullName                 *string
		PrimaryEmailAddress      *string
		AdditionalEmailAddresses *[]string
		Kind                     *PeopleKind
	}
)

func (p People) CursorKey() page.CursorKey {
	return page.NewCursorKey(p.ID, p.CreatedAt)
}

func (p *People) scan(r pgx.Row) error {
	return r.Scan(
		&p.ID,
		&p.OrganizationID,
		&p.Kind,
		&p.FullName,
		&p.PrimaryEmailAddress,
		&p.AdditionalEmailAddresses,
		&p.CreatedAt,
		&p.UpdatedAt,
		&p.Version,
	)
}

func (p *People) LoadByID(
	ctx context.Context,
	conn pg.Conn,
	scope *Scope,
	peopleID gid.GID,
) error {
	q := `
SELECT
    id,
    organization_id,
    kind,
    full_name,
    primary_email_address,
    additional_email_addresses,
    created_at,
    updated_at,
    version
FROM
    peoples
WHERE
    %s
    AND id = @people_id
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.NamedArgs{"people_id": peopleID}
	maps.Copy(args, scope.SQLArguments())

	r := conn.QueryRow(ctx, q, args)

	p2 := People{}
	if err := p2.scan(r); err != nil {
		return err
	}

	*p = p2

	return nil
}

func (p People) Insert(
	ctx context.Context,
	conn pg.Conn,
) error {
	q := `
INSERT INTO
    peoples (
        id,
        organization_id,
        kind,
        full_name,
        primary_email_address,
        additional_email_addresses,
        created_at,
        updated_at,
        version
    )
VALUES (
    @people_id,
    @organization_id,
    @kind,
    @full_name,
    @primary_email_address,
    @additional_email_addresses,
    @created_at,
    @updated_at,
    @version
)
`

	args := pgx.NamedArgs{
		"people_id":                  p.ID,
		"organization_id":            p.OrganizationID,
		"kind":                       p.Kind,
		"full_name":                  p.FullName,
		"primary_email_address":      p.PrimaryEmailAddress,
		"additional_email_addresses": p.AdditionalEmailAddresses,
		"created_at":                 p.CreatedAt,
		"updated_at":                 p.UpdatedAt,
		"version":                    p.Version,
	}
	_, err := conn.Exec(ctx, q, args)
	return err
}

func (p People) Delete(
	ctx context.Context,
	conn pg.Conn,
	scope *Scope,
) error {
	q := `
DELETE FROM peoples WHERE %s AND id = @people_id
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.NamedArgs{"people_id": p.ID}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	return err
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
    kind,
    full_name,
    primary_email_address,
    additional_email_addresses,
    created_at,
    updated_at,
    version
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

func (p *People) Update(
	ctx context.Context,
	conn pg.Conn,
	scope *Scope,
	params UpdatePeopleParams,
) error {
	q := `
UPDATE peoples SET
    full_name = COALESCE(@full_name, full_name),
    primary_email_address = COALESCE(@primary_email_address, primary_email_address),
    additional_email_addresses = COALESCE(@additional_email_addresses, additional_email_addresses),
    kind = COALESCE(@kind, kind),
    updated_at = @updated_at,
    version = version + 1
WHERE %s
    AND id = @people_id
    AND version = @expected_version
RETURNING 
   	id,
	organization_id,
	kind,
	full_name,
	primary_email_address,
	additional_email_addresses,
	created_at,
	updated_at,
	version
`
	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.NamedArgs{
		"people_id":        p.ID,
		"expected_version": params.ExpectedVersion,
		"updated_at":       time.Now(),
	}

	if params.FullName != nil {
		args["full_name"] = *params.FullName
	}
	if params.PrimaryEmailAddress != nil {
		args["primary_email_address"] = *params.PrimaryEmailAddress
	}
	if params.AdditionalEmailAddresses != nil {
		args["additional_email_addresses"] = *params.AdditionalEmailAddresses
	}
	if params.Kind != nil {
		args["kind"] = *params.Kind
	}

	maps.Copy(args, scope.SQLArguments())

	r := conn.QueryRow(ctx, q, args)

	p2 := People{}
	if err := p2.scan(r); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrConcurrentModification
		}
		return err
	}

	*p = p2
	return nil
}
