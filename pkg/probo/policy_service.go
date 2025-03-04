package probo

import (
	"context"
	"fmt"
	"time"

	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/page"
	"github.com/getprobo/probo/pkg/probo/coredata"
	"go.gearno.de/kit/pg"
)

type PolicyService struct {
	svc *Service
}

type (
	CreatePolicyRequest struct {
		OrganizationID gid.GID
		Name           string
		Status         coredata.PolicyStatus
		Content        string
	}

	UpdatePolicyRequest struct {
		ID              gid.GID
		ExpectedVersion int
		Name            *string
		Content         *string
		Status          *coredata.PolicyStatus
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
	policyID, err := gid.NewGID(coredata.PolicyEntityType)
	if err != nil {
		return nil, fmt.Errorf("cannot create policy global id: %w", err)
	}

	organization := &coredata.Organization{}
	policy := &coredata.Policy{
		ID:             policyID,
		OrganizationID: req.OrganizationID,
		Name:           req.Name,
		Content:        req.Content,
		Status:         req.Status,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	err = s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := organization.LoadByID(ctx, conn, s.svc.scope, req.OrganizationID); err != nil {
				return fmt.Errorf("cannot load organization %q: %w", req.OrganizationID, err)
			}

			if err := policy.Insert(ctx, conn); err != nil {
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
	params := coredata.UpdatePolicyParams{
		ExpectedVersion: req.ExpectedVersion,
		Name:            req.Name,
		Content:         req.Content,
		Status:          req.Status,
	}

	policy := &coredata.Policy{ID: req.ID}

	err := s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			return policy.Update(ctx, conn, s.svc.scope, params)
		})
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

func (s *PolicyService) ListByOrganization(
	ctx context.Context,
	organizationID gid.GID,
	cursor *page.Cursor,
) (*page.Page[*coredata.Policy], error) {
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
