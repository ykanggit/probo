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
	"time"

	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/probo/coredata"
	"go.gearno.de/kit/pg"
)

type UpdateVendorRequest struct {
	ID                   gid.GID
	ExpectedVersion      int
	Name                 *string
	Description          *string
	ServiceStartAt       *time.Time
	ServiceTerminationAt *time.Time
	ServiceCriticality   *coredata.ServiceCriticality
	RiskTier             *coredata.RiskTier
	StatusPageURL        *string
	TermsOfServiceURL    *string
	PrivacyPolicyURL     *string
}

func (s Service) UpdateVendor(
	ctx context.Context,
	req UpdateVendorRequest,
) (*coredata.Vendor, error) {
	params := coredata.UpdateVendorParams{
		ExpectedVersion:      req.ExpectedVersion,
		Name:                 req.Name,
		Description:          req.Description,
		ServiceStartAt:       req.ServiceStartAt,
		ServiceTerminationAt: req.ServiceTerminationAt,
		ServiceCriticality:   req.ServiceCriticality,
		RiskTier:             req.RiskTier,
		StatusPageURL:        req.StatusPageURL,
		TermsOfServiceURL:    req.TermsOfServiceURL,
		PrivacyPolicyURL:     req.PrivacyPolicyURL,
	}

	vendor := &coredata.Vendor{ID: req.ID}

	err := s.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			return vendor.Update(ctx, conn, s.scope, params)
		})
	if err != nil {
		return nil, err
	}

	return vendor, nil
}
