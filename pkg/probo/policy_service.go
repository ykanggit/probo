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
		Title          string
		Content        string
		OwnerID        gid.GID
		CreatedBy      gid.GID
	}

	UpdatePolicyVersionRequest struct {
		ID      gid.GID
		Content string
	}

	RequestSignatureRequest struct {
		PolicyVersionID gid.GID
		RequestedBy     gid.GID
		Signatory       gid.GID
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

func (s *PolicyService) PublishVersion(
	ctx context.Context,
	policyID gid.GID,
	publishedBy gid.GID,
) (*coredata.Policy, *coredata.PolicyVersion, error) {
	policy := &coredata.Policy{}
	policyVersion := &coredata.PolicyVersion{}
	now := time.Now()

	err := s.svc.pg.WithTx(
		ctx,
		func(tx pg.Conn) error {
			if err := policy.LoadByID(ctx, tx, s.svc.scope, policyID); err != nil {
				return fmt.Errorf("cannot load policy %q: %w", policyID, err)
			}

			if err := policyVersion.LoadLatestVersion(ctx, tx, s.svc.scope, policyID); err != nil {
				return fmt.Errorf("cannot load current draft: %w", err)
			}

			if policyVersion.Status != coredata.PolicyStatusDraft {
				return fmt.Errorf("cannot publish version")
			}

			policy.CurrentPublishedVersion = &policyVersion.VersionNumber
			policy.UpdatedAt = now

			policyVersion.Status = coredata.PolicyStatusPublished
			policyVersion.PublishedAt = &now
			policyVersion.PublishedBy = &publishedBy
			policyVersion.UpdatedAt = now

			if err := policy.Update(ctx, tx, s.svc.scope); err != nil {
				return fmt.Errorf("cannot update policy: %w", err)
			}

			if err := policyVersion.Update(ctx, tx, s.svc.scope); err != nil {
				return fmt.Errorf("cannot update policy version: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, nil, err
	}

	return policy, policyVersion, nil
}

func (s *PolicyService) Create(
	ctx context.Context,
	req CreatePolicyRequest,
) (*coredata.Policy, *coredata.PolicyVersion, error) {
	now := time.Now()
	policyID, err := gid.NewGID(s.svc.scope.GetTenantID(), coredata.PolicyEntityType)
	if err != nil {
		return nil, nil, fmt.Errorf("cannot create policy global id: %w", err)
	}

	policyVersionID, err := gid.NewGID(s.svc.scope.GetTenantID(), coredata.PolicyVersionEntityType)
	if err != nil {
		return nil, nil, fmt.Errorf("cannot create policy version global id: %w", err)
	}

	policy := &coredata.Policy{
		ID:             policyID,
		OrganizationID: req.OrganizationID,
		OwnerID:        req.OwnerID,
		Title:          req.Title,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	policyVersion := &coredata.PolicyVersion{
		ID:            policyVersionID,
		PolicyID:      policyID,
		VersionNumber: 1,
		Content:       req.Content,
		CreatedBy:     req.CreatedBy,
		CreatedAt:     now,
		UpdatedAt:     now,
	}
	err = s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := policy.Insert(ctx, conn, s.svc.scope); err != nil {
				return fmt.Errorf("cannot insert policy: %w", err)
			}

			if err := policyVersion.Update(ctx, conn, s.svc.scope); err != nil {
				return fmt.Errorf("cannot create policy version: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, nil, err
	}

	return policy, policyVersion, nil
}

func (s *PolicyService) UpdateVersion(
	ctx context.Context,
	req UpdatePolicyVersionRequest,
) (*coredata.PolicyVersion, error) {
	policyVersion := &coredata.PolicyVersion{}

	err := s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := policyVersion.LoadByID(ctx, conn, s.svc.scope, req.ID); err != nil {
				return fmt.Errorf("cannot load policy version %q: %w", req.ID, err)
			}

			if policyVersion.Status != coredata.PolicyStatusDraft {
				return fmt.Errorf("cannot update published version")
			}

			policyVersion.Content = req.Content
			policyVersion.UpdatedAt = time.Now()

			if err := policyVersion.Update(ctx, conn, s.svc.scope); err != nil {
				return fmt.Errorf("cannot update policy version: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return policyVersion, nil
}

func (s *PolicyService) GetVersionSignature(
	ctx context.Context,
	signatureID gid.GID,
) (*coredata.PolicyVersionSignature, error) {
	policyVersionSignature := &coredata.PolicyVersionSignature{}

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return policyVersionSignature.LoadByID(ctx, conn, s.svc.scope, signatureID)
		},
	)

	if err != nil {
		return nil, err
	}

	return policyVersionSignature, nil
}

func (s *PolicyService) RequestSignature(
	ctx context.Context,
	req RequestSignatureRequest,
) (*coredata.PolicyVersionSignature, error) {
	policyVersionSignatureID, err := gid.NewGID(s.svc.scope.GetTenantID(), coredata.PolicyVersionSignatureEntityType)
	if err != nil {
		return nil, fmt.Errorf("cannot create policy version signature global id: %w", err)
	}

	policyVersion, err := s.GetVersion(ctx, req.PolicyVersionID)
	if err != nil {
		return nil, fmt.Errorf("cannot get policy version: %w", err)
	}

	if policyVersion.Status != coredata.PolicyStatusPublished {
		return nil, fmt.Errorf("cannot request signature for unpublished version")
	}

	now := time.Now()
	policyVersionSignature := &coredata.PolicyVersionSignature{
		ID:              policyVersionSignatureID,
		PolicyVersionID: req.PolicyVersionID,
		State:           coredata.PolicyVersionSignatureStateRequested,
		RequestedBy:     req.RequestedBy,
		RequestedAt:     now,
		SignedBy:        req.Signatory,
		SignedAt:        nil,
		CreatedAt:       now,
		UpdatedAt:       now,
	}

	err = s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := policyVersionSignature.Insert(ctx, conn, s.svc.scope); err != nil {
				return fmt.Errorf("cannot insert policy version signature: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return policyVersionSignature, nil
}

func (s *PolicyService) ListSignatures(
	ctx context.Context,
	policyVersionID gid.GID,
	cursor *page.Cursor[coredata.PolicyVersionSignatureOrderField],
) (*page.Page[*coredata.PolicyVersionSignature, coredata.PolicyVersionSignatureOrderField], error) {
	var policyVersionSignatures coredata.PolicyVersionSignatures

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return policyVersionSignatures.LoadByPolicyVersionID(ctx, conn, s.svc.scope, policyVersionID, cursor)
		},
	)

	if err != nil {
		return nil, err
	}

	return page.NewPage(policyVersionSignatures, cursor), nil
}

func (s *PolicyService) CreateDraft(
	ctx context.Context,
	policyID gid.GID,
	createdBy gid.GID,
) (*coredata.PolicyVersion, error) {
	draftVersionID, err := gid.NewGID(s.svc.scope.GetTenantID(), coredata.PolicyVersionEntityType)
	if err != nil {
		return nil, fmt.Errorf("cannot create policy version global id: %w", err)
	}

	latestVersion := &coredata.PolicyVersion{}
	draftVersion := &coredata.PolicyVersion{}
	now := time.Now()

	err = s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := latestVersion.LoadLatestVersion(ctx, conn, s.svc.scope, policyID); err != nil {
				return fmt.Errorf("cannot load latest version: %w", err)
			}

			if latestVersion.Status != coredata.PolicyStatusPublished {
				return fmt.Errorf("cannot create draft from unpublished version")
			}

			draftVersion.ID = draftVersionID
			draftVersion.PolicyID = policyID
			draftVersion.VersionNumber = latestVersion.VersionNumber + 1
			draftVersion.Content = latestVersion.Content
			draftVersion.Status = coredata.PolicyStatusDraft
			draftVersion.CreatedBy = createdBy
			draftVersion.CreatedAt = now
			draftVersion.UpdatedAt = now

			if err := draftVersion.Insert(ctx, conn, s.svc.scope); err != nil {
				return fmt.Errorf("cannot create draft: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return draftVersion, nil
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

func (s *PolicyService) ListVersions(
	ctx context.Context,
	policyID gid.GID,
	cursor *page.Cursor[coredata.PolicyVersionOrderField],
) (*page.Page[*coredata.PolicyVersion, coredata.PolicyVersionOrderField], error) {
	var policyVersions coredata.PolicyVersions

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return policyVersions.LoadByPolicyID(ctx, conn, s.svc.scope, policyID, cursor)
		},
	)

	if err != nil {
		return nil, err
	}

	return page.NewPage(policyVersions, cursor), nil
}

func (s *PolicyService) GetVersion(
	ctx context.Context,
	policyVersionID gid.GID,
) (*coredata.PolicyVersion, error) {
	policyVersion := &coredata.PolicyVersion{}

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return policyVersion.LoadByID(ctx, conn, s.svc.scope, policyVersionID)
		},
	)

	if err != nil {
		return nil, err
	}

	return policyVersion, nil
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
