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
	VendorDataPrivacyAgreement struct {
		ID             gid.GID      `db:"id"`
		TenantID       gid.TenantID `db:"tenant_id"`
		OrganizationID gid.GID      `db:"organization_id"`
		VendorID       gid.GID      `db:"vendor_id"`
		ValidFrom      *time.Time   `db:"valid_from"`
		ValidUntil     *time.Time   `db:"valid_until"`
		FileID         gid.GID      `db:"file_id"`
		CreatedAt      time.Time    `db:"created_at"`
		UpdatedAt      time.Time    `db:"updated_at"`
	}

	VendorDataPrivacyAgreements []*VendorDataPrivacyAgreement
)

func (v VendorDataPrivacyAgreement) CursorKey(orderBy VendorDataPrivacyAgreementOrderField) page.CursorKey {
	switch orderBy {
	case VendorDataPrivacyAgreementOrderFieldValidFrom:
		return page.NewCursorKey(v.ID, v.ValidFrom)
	case VendorDataPrivacyAgreementOrderFieldCreatedAt:
		return page.NewCursorKey(v.ID, v.CreatedAt)
	}

	panic(fmt.Sprintf("unsupported order by: %s", orderBy))
}

func (vdpa *VendorDataPrivacyAgreement) LoadByVendorID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	vendorID gid.GID,
) error {
	q := `
SELECT
	id,
	tenant_id,
	organization_id,
	vendor_id,
	valid_from,
	valid_until,
	file_id,
	created_at,
	updated_at
FROM
	vendor_data_privacy_agreements
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
		return fmt.Errorf("cannot query vendor data privacy agreement: %w", err)
	}

	vendorDataPrivacyAgreement, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[VendorDataPrivacyAgreement])
	if err != nil {
		return fmt.Errorf("cannot collect vendor data privacy agreement: %w", err)
	}

	*vdpa = vendorDataPrivacyAgreement

	return nil
}

func (vdpa *VendorDataPrivacyAgreement) LoadByID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	vendorDataPrivacyAgreementID gid.GID,
) error {
	q := `
SELECT
	id,
	tenant_id,
	organization_id,
	vendor_id,
	valid_from,
	valid_until,
	file_id,
	created_at,
	updated_at
FROM
	vendor_data_privacy_agreements
WHERE
	%s
	AND id = @id
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.NamedArgs{"id": vendorDataPrivacyAgreementID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query vendor data privacy agreement: %w", err)
	}

	vendorDataPrivacyAgreement, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[VendorDataPrivacyAgreement])
	if err != nil {
		return fmt.Errorf("cannot collect vendor data privacy agreement: %w", err)
	}

	*vdpa = vendorDataPrivacyAgreement

	return nil
}

func (vdpa *VendorDataPrivacyAgreement) Update(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
UPDATE
	vendor_data_privacy_agreements
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
		"id":          vdpa.ID,
		"valid_from":  vdpa.ValidFrom,
		"valid_until": vdpa.ValidUntil,
		"file_id":     vdpa.FileID,
		"updated_at":  vdpa.UpdatedAt,
	}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot update vendor data privacy agreement: %w", err)
	}

	return nil
}

func (vdpa *VendorDataPrivacyAgreement) Upsert(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
INSERT INTO
	vendor_data_privacy_agreements (
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
		"id":              vdpa.ID,
		"tenant_id":       scope.GetTenantID(),
		"vendor_id":       vdpa.VendorID,
		"organization_id": vdpa.OrganizationID,
		"valid_from":      vdpa.ValidFrom,
		"valid_until":     vdpa.ValidUntil,
		"file_id":         vdpa.FileID,
		"created_at":      vdpa.CreatedAt,
		"updated_at":      vdpa.UpdatedAt,
	}

	_, err := conn.Exec(ctx, q, args)
	return err
}

func (vdpa *VendorDataPrivacyAgreement) Delete(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
DELETE
FROM
	vendor_data_privacy_agreements
WHERE
	%s
	AND id = @id
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"id": vdpa.ID}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	return err
}

func (vdpa *VendorDataPrivacyAgreement) DeleteByVendorID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	vendorID gid.GID,
) error {
	q := `
DELETE
FROM
	vendor_data_privacy_agreements
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
