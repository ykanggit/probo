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
	Organization struct {
		ID                      gid.GID      `db:"id"`
		TenantID                gid.TenantID `db:"tenant_id"`
		Name                    string       `db:"name"`
		LogoObjectKey           string       `db:"logo_object_key"`
		MailingAddress          *string      `db:"mailing_address"`
		TelephoneNumber         *string      `db:"telephone_number"`
		WebsiteURL              *string      `db:"website_url"`
		SecurityComplianceEmail *string      `db:"security_compliance_email"`
		CompanyDescription      *string      `db:"company_description"`
		CompanyLegalName        *string      `db:"company_legal_name"`
		CreatedAt               time.Time    `db:"created_at"`
		UpdatedAt               time.Time    `db:"updated_at"`
	}

	Organizations []*Organization
)

func (o Organization) CursorKey(orderBy OrganizationOrderField) page.CursorKey {
	switch orderBy {
	case OrganizationOrderFieldCreatedAt:
		return page.NewCursorKey(o.ID, o.CreatedAt)
	}

	panic(fmt.Sprintf("unsupported order by: %s", orderBy))
}

func (o *Organization) LoadByID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	organizationID gid.GID,
) error {
	q := `
SELECT
    tenant_id,
    id,
    name,
    logo_object_key,
    mailing_address,
    telephone_number,
    website_url,
    security_compliance_email,
    company_description,
    company_legal_name,
    created_at,
    updated_at
FROM
    organizations
WHERE
    %s
    AND id = @organization_id
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"organization_id": organizationID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query organizations: %w", err)
	}

	organization, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[Organization])
	if err != nil {
		return fmt.Errorf("cannot collect organization: %w", err)
	}

	*o = organization

	return nil
}

func (o *Organization) Insert(
	ctx context.Context,
	conn pg.Conn,
) error {
	q := `
INSERT INTO organizations (
    tenant_id,
    id,
    name,
    logo_object_key,
    mailing_address,
    telephone_number,
    website_url,
    security_compliance_email,
    company_description,
    company_legal_name,
    created_at,
    updated_at
) VALUES (@tenant_id, @id, @name, @logo_object_key, @mailing_address, @telephone_number, @website_url, @security_compliance_email, @company_description, @company_legal_name, @created_at, @updated_at)
`

	args := pgx.StrictNamedArgs{
		"tenant_id":                 o.TenantID,
		"id":                        o.ID,
		"name":                      o.Name,
		"logo_object_key":           o.LogoObjectKey,
		"mailing_address":           o.MailingAddress,
		"telephone_number":          o.TelephoneNumber,
		"website_url":               o.WebsiteURL,
		"security_compliance_email": o.SecurityComplianceEmail,
		"company_description":       o.CompanyDescription,
		"company_legal_name":        o.CompanyLegalName,
		"created_at":                o.CreatedAt,
		"updated_at":                o.UpdatedAt,
	}

	_, err := conn.Exec(ctx, q, args)
	if err != nil {
		return err
	}

	return nil
}

func (o *Organization) Update(
	ctx context.Context,
	scope Scoper,
	conn pg.Conn,
) error {
	q := `
UPDATE organizations
SET
    name = @name,
    logo_object_key = @logo_object_key,
    mailing_address = @mailing_address,
    telephone_number = @telephone_number,
    website_url = @website_url,
    security_compliance_email = @security_compliance_email,
    company_description = @company_description,
    company_legal_name = @company_legal_name,
    updated_at = @updated_at
WHERE
    %s
    AND id = @id
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{
		"id":                        o.ID,
		"name":                      o.Name,
		"logo_object_key":           o.LogoObjectKey,
		"mailing_address":           o.MailingAddress,
		"telephone_number":          o.TelephoneNumber,
		"website_url":               o.WebsiteURL,
		"security_compliance_email": o.SecurityComplianceEmail,
		"company_description":       o.CompanyDescription,
		"company_legal_name":        o.CompanyLegalName,
		"updated_at":                o.UpdatedAt,
	}

	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot update organization: %w", err)
	}

	return nil
}

func (o *Organization) Delete(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
DELETE FROM organizations
WHERE
    %s
    AND id = @id
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"id": o.ID}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot delete organization: %w", err)
	}

	return nil
}
