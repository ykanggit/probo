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
	VendorBusinessAssociateAgreement struct {
		ID             gid.GID    `db:"id"`
		OrganizationID gid.GID    `db:"organization_id"`
		VendorID       gid.GID    `db:"vendor_id"`
		ValidFrom      *time.Time `db:"valid_from"`
		ValidUntil     *time.Time `db:"valid_until"`
		FileID         gid.GID    `db:"file_id"`
		CreatedAt      time.Time  `db:"created_at"`
		UpdatedAt      time.Time  `db:"updated_at"`
	}

	VendorBusinessAssociateAgreements []*VendorBusinessAssociateAgreement
)

func (v VendorBusinessAssociateAgreement) CursorKey(orderBy VendorBusinessAssociateAgreementOrderField) page.CursorKey {
	switch orderBy {
	case VendorBusinessAssociateAgreementOrderFieldValidFrom:
		return page.NewCursorKey(v.ID, v.ValidFrom)
	case VendorBusinessAssociateAgreementOrderFieldCreatedAt:
		return page.NewCursorKey(v.ID, v.CreatedAt)
	}

	panic(fmt.Sprintf("unsupported order by: %s", orderBy))
}

func (vbaa *VendorBusinessAssociateAgreement) LoadByVendorID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	vendorID gid.GID,
) error {
	q := `
SELECT
	id,
	organization_id,
	vendor_id,
	valid_from,
	valid_until,
	file_id,
	created_at,
	updated_at
FROM
	vendor_business_associate_agreements
WHERE
	%s
	AND vendor_id = @vendor_id
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.NamedArgs{"vendor_id": vendorID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query vendor business associate agreement: %w", err)
	}

	vendorBusinessAssociateAgreement, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[VendorBusinessAssociateAgreement])
	if err != nil {
		return fmt.Errorf("cannot collect vendor business associate agreement: %w", err)
	}

	*vbaa = vendorBusinessAssociateAgreement

	return nil
}

func (vbaa *VendorBusinessAssociateAgreement) LoadByID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	vendorBusinessAssociateAgreementID gid.GID,
) error {
	q := `
SELECT
	id,
	organization_id,
	vendor_id,
	valid_from,
	valid_until,
	file_id,
	created_at,
	updated_at
FROM
	vendor_business_associate_agreements
WHERE
	%s
	AND id = @id
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.NamedArgs{"id": vendorBusinessAssociateAgreementID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query vendor business associate agreement: %w", err)
	}

	vendorBusinessAssociateAgreement, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[VendorBusinessAssociateAgreement])
	if err != nil {
		return fmt.Errorf("cannot collect vendor business associate agreement: %w", err)
	}

	*vbaa = vendorBusinessAssociateAgreement

	return nil
}

func (vbaa *VendorBusinessAssociateAgreement) Update(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
UPDATE
	vendor_business_associate_agreements
SET
	valid_from = @valid_from,
	valid_until = @valid_until,
	file_id = @file_id,
	updated_at = @updated_at
WHERE
	%s
	AND id = @id
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{
		"id":          vbaa.ID,
		"valid_from":  vbaa.ValidFrom,
		"valid_until": vbaa.ValidUntil,
		"file_id":     vbaa.FileID,
		"updated_at":  vbaa.UpdatedAt,
	}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot update vendor business associate agreement: %w", err)
	}

	return nil
}

func (vbaa *VendorBusinessAssociateAgreement) Upsert(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
INSERT INTO
	vendor_business_associate_agreements (
		id,
		tenant_id,
		organization_id,
		vendor_id,
		valid_from,
		valid_until,
		file_id,
		created_at,
		updated_at
	)
VALUES (
	@id,
	@tenant_id,
	@organization_id,
	@vendor_id,
	@valid_from,
	@valid_until,
	@file_id,
	@created_at,
	@updated_at
)
ON CONFLICT (organization_id, vendor_id) DO UPDATE SET
	id = EXCLUDED.id,
	valid_from = EXCLUDED.valid_from,
	valid_until = EXCLUDED.valid_until,
	file_id = EXCLUDED.file_id,
	updated_at = EXCLUDED.updated_at
`
	args := pgx.StrictNamedArgs{
		"id":              vbaa.ID,
		"tenant_id":       scope.GetTenantID(),
		"vendor_id":       vbaa.VendorID,
		"organization_id": vbaa.OrganizationID,
		"valid_from":      vbaa.ValidFrom,
		"valid_until":     vbaa.ValidUntil,
		"file_id":         vbaa.FileID,
		"created_at":      vbaa.CreatedAt,
		"updated_at":      vbaa.UpdatedAt,
	}

	_, err := conn.Exec(ctx, q, args)
	return err
}

func (vbaa *VendorBusinessAssociateAgreement) Delete(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
DELETE
FROM
	vendor_business_associate_agreements
WHERE
	%s
	AND id = @id
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"id": vbaa.ID}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	return err
}

func (vbaa *VendorBusinessAssociateAgreement) DeleteByVendorID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	vendorID gid.GID,
) error {
	q := `
DELETE
FROM
	vendor_business_associate_agreements
WHERE
	%s
	AND vendor_id = @vendor_id
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"vendor_id": vendorID}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	return err
}
