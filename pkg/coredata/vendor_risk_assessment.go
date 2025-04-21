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
	// RiskAssessment represents a point-in-time risk assessment for a vendor
	VendorRiskAssessment struct {
		ID              gid.GID         `db:"id"`
		VendorID        gid.GID         `db:"vendor_id"`
		AssessedAt      time.Time       `db:"assessed_at"`
		AssessedBy      gid.GID         `db:"assessed_by"`
		AccessedAt      time.Time       `db:"accessed_at"`
		ApprovedBy      gid.GID         `db:"approved_by"`
		ApprovedAt      time.Time       `db:"approved_at"`
		ExpiresAt       time.Time       `db:"expires_at"`
		DataSensitivity DataSensitivity `db:"data_sensitivity"`
		BusinessImpact  BusinessImpact  `db:"business_impact"`
		Notes           *string         `db:"notes"`
		CreatedAt       time.Time       `db:"created_at"`
		UpdatedAt       time.Time       `db:"updated_at"`
	}

	// DataSensitivity represents the level of data sensitivity handled by a vendor
	DataSensitivity string

	// BusinessImpact represents the impact level the vendor has on business operations
	BusinessImpact string

	// RiskAssessments is a collection of RiskAssessment objects
	VendorRiskAssessments []*VendorRiskAssessment
)

// Constants for DataSensitivity
const (
	DataSensitivityNone     DataSensitivity = "NONE"     // No sensitive data
	DataSensitivityLow      DataSensitivity = "LOW"      // Public or non-sensitive data
	DataSensitivityMedium   DataSensitivity = "MEDIUM"   // Internal/restricted data
	DataSensitivityHigh     DataSensitivity = "HIGH"     // Confidential data
	DataSensitivityCritical DataSensitivity = "CRITICAL" // Regulated/PII/financial data
)

// Constants for BusinessImpact
const (
	BusinessImpactLow      BusinessImpact = "LOW"      // Minimal impact on business
	BusinessImpactMedium   BusinessImpact = "MEDIUM"   // Moderate impact on business
	BusinessImpactHigh     BusinessImpact = "HIGH"     // Significant business impact
	BusinessImpactCritical BusinessImpact = "CRITICAL" // Critical to business operations
)

func (v VendorRiskAssessment) CursorKey(orderBy VendorRiskAssessmentOrderField) page.CursorKey {
	switch orderBy {
	case VendorRiskAssessmentOrderFieldCreatedAt:
		return page.NewCursorKey(v.ID, v.CreatedAt)
	case VendorRiskAssessmentOrderFieldExpiresAt:
		return page.NewCursorKey(v.ID, v.ExpiresAt)
	}

	panic(fmt.Sprintf("unsupported order by: %s", orderBy))
}

// Insert adds a new risk assessment to the database
func (r VendorRiskAssessment) Insert(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
INSERT INTO
    risk_assessments (
        tenant_id,
        id,
        vendor_id,
        assessed_at,
        assessed_by,
        accessed_at,
        approved_by,
        approved_at,
        expires_at,
        data_sensitivity,
        business_impact,
        notes,
        created_at,
        updated_at
    )
VALUES (
    @tenant_id,
    @id,
    @vendor_id,
    @assessed_at,
    @assessed_by,
    @expires_at,
    @data_sensitivity,
    @business_impact,
    @notes,
    @attachments,
    @created_at,
    @updated_at
)
`

	args := pgx.StrictNamedArgs{
		"tenant_id":        scope.GetTenantID(),
		"id":               r.ID,
		"vendor_id":        r.VendorID,
		"assessed_at":      r.AssessedAt,
		"assessed_by":      r.AssessedBy,
		"accessed_at":      r.AccessedAt,
		"approved_by":      r.ApprovedBy,
		"approved_at":      r.ApprovedAt,
		"expires_at":       r.ExpiresAt,
		"data_sensitivity": r.DataSensitivity,
		"business_impact":  r.BusinessImpact,
		"notes":            r.Notes,
		"created_at":       r.CreatedAt,
		"updated_at":       r.UpdatedAt,
	}
	_, err := conn.Exec(ctx, q, args)
	return err
}

// LoadByID loads a risk assessment by its ID
func (r *VendorRiskAssessment) LoadByID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	id gid.GID,
) error {
	q := `
SELECT
    id,
    vendor_id,
    assessed_at,
    assessed_by,
    accessed_at,
    approved_by,
    approved_at,
    expires_at,
    data_sensitivity,
    business_impact,
    notes,
    created_at,
    updated_at
FROM
    risk_assessments
WHERE
    %s
    AND id = @id
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"id": id}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query risk assessment: %w", err)
	}
	defer rows.Close()

	assessment, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[VendorRiskAssessment])
	if err != nil {
		return fmt.Errorf("cannot collect risk assessment: %w", err)
	}

	*r = assessment

	return nil
}

// LoadLatestByVendorID loads the most recent risk assessment for a vendor
func (r *VendorRiskAssessment) LoadLatestByVendorID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	vendorID gid.GID,
) error {
	q := `
SELECT
    id,
    vendor_id,
    assessed_at,
    assessed_by,
    accessed_at,
    approved_by,
    approved_at,
    expires_at,
    data_sensitivity,
    business_impact,
    notes,
    created_at,
    updated_at
FROM
    risk_assessments
WHERE
    %s
    AND vendor_id = @vendor_id
ORDER BY
    assessed_at DESC
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"vendor_id": vendorID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query risk assessment: %w", err)
	}
	defer rows.Close()

	assessment, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[VendorRiskAssessment])
	if err != nil {
		return fmt.Errorf("cannot collect risk assessment: %w", err)
	}

	*r = assessment

	return nil
}

// LoadByVendorID loads all risk assessments for a vendor, ordered by assessment date
func (r *VendorRiskAssessments) LoadByVendorID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	vendorID gid.GID,
	cursor *page.Cursor[VendorRiskAssessmentOrderField],
) error {
	q := `
SELECT
    id,
    vendor_id,
    assessed_at,
    assessed_by,
    accessed_at,
    approved_by,
    approved_at,
    expires_at,
    data_sensitivity,
    business_impact,
    notes,
    created_at,
    updated_at
FROM
    risk_assessments
WHERE
    %s
    AND vendor_id = @vendor_id
	AND %s
`

	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.StrictNamedArgs{"vendor_id": vendorID}
	maps.Copy(args, scope.SQLArguments())
	maps.Copy(args, cursor.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query risk assessments: %w", err)
	}

	assessments, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[VendorRiskAssessment])
	if err != nil {
		return fmt.Errorf("cannot collect risk assessments: %w", err)
	}

	*r = assessments

	return nil
}
