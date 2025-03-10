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

package probo

import (
	"context"
	"fmt"
	"time"

	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/probo/coredata"
	"go.gearno.de/kit/pg"
)

type (
	CreateVendorRequest struct {
		OrganizationID       gid.GID
		Name                 string
		Description          string
		ServiceStartAt       time.Time
		ServiceTerminationAt *time.Time
		ServiceCriticality   coredata.ServiceCriticality
		RiskTier             coredata.RiskTier
		StatusPageURL        *string
		TermsOfServiceURL    *string
		PrivacyPolicyURL     *string
	}
)

func (s Service) CreateVendor(
	ctx context.Context,
	req CreateVendorRequest,
) (*coredata.Vendor, error) {
	now := time.Now()
	vendorID, err := gid.NewGID(s.scope.GetTenantID(), coredata.VendorEntityType)
	if err != nil {
		return nil, fmt.Errorf("cannot create vendor global id: %w", err)
	}

	organization := &coredata.Organization{}
	vendor := &coredata.Vendor{
		ID:                   vendorID,
		OrganizationID:       req.OrganizationID,
		Name:                 req.Name,
		CreatedAt:            now,
		UpdatedAt:            now,
		Description:          req.Description,
		ServiceStartAt:       req.ServiceStartAt,
		ServiceTerminationAt: req.ServiceTerminationAt,
		ServiceCriticality:   req.ServiceCriticality,
		RiskTier:             req.RiskTier,
		StatusPageURL:        req.StatusPageURL,
		TermsOfServiceURL:    req.TermsOfServiceURL,
		PrivacyPolicyURL:     req.PrivacyPolicyURL,
	}

	err = s.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := organization.LoadByID(ctx, conn, s.scope, req.OrganizationID); err != nil {
				return fmt.Errorf("cannot load organization %q: %w", req.OrganizationID, err)
			}

			if err := vendor.Insert(ctx, conn, s.scope); err != nil {
				return fmt.Errorf("cannot insert vendor: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return vendor, nil
}
