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
