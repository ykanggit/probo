package probo

import (
	"context"
	"fmt"
	"time"

	"github.com/getprobo/probo/pkg/coredata"
	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/page"
	"go.gearno.de/kit/pg"
)

type PolicyService struct {
	svc *TenantService
}

type (
	CreatePolicyRequest struct {
		OrganizationID gid.GID
		Name           string
		Status         coredata.PolicyStatus
		Content        string
		ReviewDate     *time.Time
		OwnerID        gid.GID
	}

	UpdatePolicyRequest struct {
		ID              gid.GID
		ExpectedVersion int
		Name            *string
		Content         *string
		Status          *coredata.PolicyStatus
		ReviewDate      *time.Time
		OwnerID         *gid.GID
	}
)

func (s *PolicyService) Get(
	ctx context.Context,
	policyID gid.GID,
) (*coredata.Policy, error) {
	policy := &coredata.Policy{}

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return policy.LoadByID(ctx, conn, s.svc.scope, policyID)
		},
	)

	if err != nil {
		return nil, err
	}

	return policy, nil
}

func (s *PolicyService) Create(
	ctx context.Context,
	req CreatePolicyRequest,
) (*coredata.Policy, error) {
	now := time.Now()
	policyID, err := gid.NewGID(s.svc.scope.GetTenantID(), coredata.PolicyEntityType)
	if err != nil {
		return nil, fmt.Errorf("cannot create policy global id: %w", err)
	}

	organization := &coredata.Organization{}
	policy := &coredata.Policy{
		ID:             policyID,
		OrganizationID: req.OrganizationID,
		OwnerID:        req.OwnerID,
		Name:           req.Name,
		Content:        req.Content,
		Status:         req.Status,
		ReviewDate:     req.ReviewDate,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	err = s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := organization.LoadByID(ctx, conn, s.svc.scope, req.OrganizationID); err != nil {
				return fmt.Errorf("cannot load organization %q: %w", req.OrganizationID, err)
			}

			if err := policy.Insert(ctx, conn, s.svc.scope); err != nil {
				return fmt.Errorf("cannot insert policy: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return policy, nil
}

func (s *PolicyService) Update(
	ctx context.Context,
	req UpdatePolicyRequest,
) (*coredata.Policy, error) {
	policy := &coredata.Policy{}

	err := s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := policy.LoadByID(ctx, conn, s.svc.scope, req.ID); err != nil {
				return fmt.Errorf("cannot load policy %q: %w", req.ID, err)
			}

			if req.Name != nil {
				policy.Name = *req.Name
			}

			if req.Content != nil {
				policy.Content = *req.Content
			}

			if req.Status != nil {
				policy.Status = *req.Status
			}

			if req.ReviewDate != nil {
				policy.ReviewDate = req.ReviewDate
			}

			if req.OwnerID != nil {
				policy.OwnerID = *req.OwnerID
			}

			if err := policy.Update(ctx, conn, s.svc.scope); err != nil {
				return fmt.Errorf("cannot update policy: %w", err)
			}

			return nil
		},
	)
	if err != nil {
		return nil, err
	}

	return policy, nil
}

func (s *PolicyService) Delete(
	ctx context.Context,
	policyID gid.GID,
) error {
	policy := coredata.Policy{ID: policyID}

	return s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return policy.Delete(ctx, conn, s.svc.scope)
		},
	)
}

func (s *PolicyService) ListByOrganizationID(
	ctx context.Context,
	organizationID gid.GID,
	cursor *page.Cursor[coredata.PolicyOrderField],
) (*page.Page[*coredata.Policy, coredata.PolicyOrderField], error) {
	var policies coredata.Policies

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return policies.LoadByOrganizationID(
				ctx,
				conn,
				s.svc.scope,
				organizationID,
				cursor,
			)
		},
	)

	if err != nil {
		return nil, err
	}

	return page.NewPage(policies, cursor), nil
}

func (s *PolicyService) ListForControlID(
	ctx context.Context,
	controlID gid.GID,
	cursor *page.Cursor[coredata.PolicyOrderField],
) (*page.Page[*coredata.Policy, coredata.PolicyOrderField], error) {
	var policies coredata.Policies

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return policies.LoadByControlID(ctx, conn, s.svc.scope, controlID, cursor)
		},
	)

	if err != nil {
		return nil, err
	}

	return page.NewPage(policies, cursor), nil
}

func (s *PolicyService) ListForRiskID(
	ctx context.Context,
	riskID gid.GID,
	cursor *page.Cursor[coredata.PolicyOrderField],
) (*page.Page[*coredata.Policy, coredata.PolicyOrderField], error) {
	var policies coredata.Policies

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return policies.LoadByRiskID(ctx, conn, s.svc.scope, riskID, cursor)
		},
	)

	if err != nil {
		return nil, err
	}

	return page.NewPage(policies, cursor), nil
}
