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
	Vendor struct {
		ID                     gid.GID
		OrganizationID         gid.GID
		Name                   string
		Description            string
		ServiceStartDate       time.Time
		ServiceTerminationDate *time.Time
		ServiceCriticality     ServiceCriticality
		RiskTier               RiskTier
		StatusPageURL          *string
		CreatedAt              time.Time
		UpdatedAt              time.Time
	}

	Vendors []*Vendor
)

func (v Vendor) CursorKey() page.CursorKey {
	return page.NewCursorKey(v.ID, v.CreatedAt)
}

func (v *Vendor) scan(r pgx.Row) error {
	return r.Scan(
		&v.ID,
		&v.OrganizationID,
		&v.Name,
		&v.Description,
		&v.ServiceStartDate,
		&v.ServiceTerminationDate,
		&v.ServiceCriticality,
		&v.RiskTier,
		&v.StatusPageURL,
		&v.CreatedAt,
		&v.UpdatedAt,
	)
}

func (v *Vendor) LoadByID(
	ctx context.Context,
	conn pg.Conn,
	scope *Scope,
	vendorID gid.GID,
) error {
	q := `
SELECT
    id,
    organization_id,
    name,
    description,
    service_start_date,
    service_termination_date,
    service_criticality,
    risk_tier,
    status_page_url,
    created_at,
    updated_at
FROM
    vendors
WHERE
    %s
    AND id = @vendor_id
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.NamedArgs{"vendor_id": vendorID}
	maps.Copy(args, scope.SQLArguments())

	r := conn.QueryRow(ctx, q, args)

	v2 := Vendor{}
	if err := v2.scan(r); err != nil {
		return err
	}

	*v = v2

	return nil
}

func (v Vendor) Insert(
	ctx context.Context,
	conn pg.Conn,
) error {
	q := `
INSERT INTO
    vendors (
        id,
        organization_id,
        name,
        description,
        service_start_date,
        service_termination_date,
        service_criticality,
        risk_tier,
        status_page_url,
        created_at,
        updated_at
    )
VALUES (
    @vendor_id,
    @organization_id,
    @name,
    @description,
    @service_start_date,
    @service_termination_date,
    @service_criticality,
    @risk_tier,
    @status_page_url,
    @created_at,
    @updated_at
)
`

	args := pgx.NamedArgs{
		"vendor_id":                v.ID,
		"organization_id":          v.OrganizationID,
		"name":                     v.Name,
		"description":              v.Description,
		"service_start_date":       v.ServiceStartDate,
		"service_termination_date": v.ServiceTerminationDate,
		"service_criticality":      v.ServiceCriticality,
		"risk_tier":                v.RiskTier,
		"status_page_url":          v.StatusPageURL,
		"created_at":               v.CreatedAt,
		"updated_at":               v.UpdatedAt,
	}
	_, err := conn.Exec(ctx, q, args)
	return err
}

func (v Vendor) Delete(
	ctx context.Context,
	conn pg.Conn,
	scope *Scope,
) error {
	q := `
DELETE FROM vendors WHERE %s AND id = @vendor_id
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.NamedArgs{"vendor_id": v.ID}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	return err
}

func (v *Vendors) LoadByOrganizationID(
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
    name,
    description,
    service_start_date,
    service_termination_date,
    service_criticality,
    risk_tier,
    status_page_url,
    created_at,
    updated_at
FROM
    vendors
WHERE
    %s
    AND organization_id = @organization_id
    AND %s
`

	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.NamedArgs{"organization_id": organizationID}
	maps.Copy(args, cursor.SQLArguments())
	maps.Copy(args, scope.SQLArguments())

	r, err := conn.Query(ctx, q, args)
	if err != nil {
		return err
	}
	defer r.Close()

	vendors := Vendors{}
	for r.Next() {
		vendor := &Vendor{}
		if err := vendor.scan(r); err != nil {
			return err
		}

		vendors = append(vendors, vendor)
	}

	if err := r.Err(); err != nil {
		return err
	}

	*v = vendors

	return nil
}
