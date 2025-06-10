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

type AssetService struct {
	svc *TenantService
}

type CreateAssetRequest struct {
	OrganizationID  gid.GID
	Name            string
	Amount          int
	OwnerID         gid.GID
	Criticity       coredata.CriticityLevel
	AssetType       coredata.AssetType
	DataTypesStored string
	VendorIDs       []gid.GID
}

type UpdateAssetRequest struct {
	ID              gid.GID
	Name            *string
	Amount          *int
	OwnerID         *gid.GID
	Criticity       *coredata.CriticityLevel
	AssetType       *coredata.AssetType
	DataTypesStored *string
	VendorIDs       []gid.GID
}

func (s AssetService) Get(
	ctx context.Context,
	assetID gid.GID,
) (*coredata.Asset, error) {
	asset := &coredata.Asset{}

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return asset.LoadByID(ctx, conn, s.svc.scope, assetID)
		},
	)

	if err != nil {
		return nil, err
	}

	return asset, nil
}

func (s AssetService) GetByOwnerID(
	ctx context.Context,
	ownerID gid.GID,
) (*coredata.Asset, error) {
	asset := &coredata.Asset{OwnerID: ownerID}

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return asset.LoadByOwnerID(ctx, conn, s.svc.scope)
		},
	)

	if err != nil {
		return nil, err
	}

	return asset, nil
}

func (s AssetService) CountForOrganizationID(
	ctx context.Context,
	organizationID gid.GID,
) (int, error) {
	var count int

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) (err error) {
			assets := coredata.Assets{}
			count, err = assets.CountByOrganizationID(ctx, conn, s.svc.scope, organizationID)
			if err != nil {
				return fmt.Errorf("cannot count assets: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return 0, err
	}

	return count, nil
}

func (s AssetService) ListForOrganizationID(
	ctx context.Context,
	organizationID gid.GID,
	cursor *page.Cursor[coredata.AssetOrderField],
) (*page.Page[*coredata.Asset, coredata.AssetOrderField], error) {
	var assets coredata.Assets

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return assets.LoadByOrganizationID(
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

	return page.NewPage(assets, cursor), nil
}

func (s AssetService) Update(
	ctx context.Context,
	req UpdateAssetRequest,
) (*coredata.Asset, error) {
	now := time.Now()

	existing := &coredata.Asset{}
	if err := s.svc.pg.WithConn(ctx, func(conn pg.Conn) error {
		return existing.LoadByID(ctx, conn, s.svc.scope, req.ID)
	}); err != nil {
		return nil, fmt.Errorf("cannot load asset: %w", err)
	}

	asset := &coredata.Asset{
		ID:              req.ID,
		OrganizationID:  existing.OrganizationID,
		Name:            existing.Name,
		Amount:          existing.Amount,
		OwnerID:         existing.OwnerID,
		Criticity:       existing.Criticity,
		AssetType:       existing.AssetType,
		DataTypesStored: existing.DataTypesStored,
		CreatedAt:       existing.CreatedAt,
		UpdatedAt:       now,
	}

	// Update fields from request
	if req.Name != nil {
		asset.Name = *req.Name
	}
	if req.Amount != nil {
		asset.Amount = *req.Amount
	}
	if req.OwnerID != nil {
		asset.OwnerID = *req.OwnerID
	}
	if req.Criticity != nil {
		asset.Criticity = *req.Criticity
	}
	if req.AssetType != nil {
		asset.AssetType = *req.AssetType
	}
	if req.DataTypesStored != nil {
		asset.DataTypesStored = *req.DataTypesStored
	}

	if err := asset.UpdateWithVendorsTx(ctx, s.svc.pg, s.svc.scope, req.VendorIDs, now); err != nil {
		return nil, err
	}

	return asset, nil
}

func (s AssetService) Create(
	ctx context.Context,
	req CreateAssetRequest,
) (*coredata.Asset, error) {
	now := time.Now()
	assetID := gid.New(s.svc.scope.GetTenantID(), coredata.AssetEntityType)

	organization := &coredata.Organization{}
	asset := &coredata.Asset{
		ID:              assetID,
		OrganizationID:  req.OrganizationID,
		Name:            req.Name,
		Amount:          req.Amount,
		OwnerID:         req.OwnerID,
		Criticity:       req.Criticity,
		AssetType:       req.AssetType,
		DataTypesStored: req.DataTypesStored,
		CreatedAt:       now,
		UpdatedAt:       now,
	}

	err := s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			return asset.CreateWithVendors(ctx, conn, s.svc.scope, organization, req.VendorIDs, now)
		},
	)

	if err != nil {
		return nil, err
	}

	return asset, nil
}

func (s AssetService) Delete(
	ctx context.Context,
	assetID gid.GID,
) error {
	asset := &coredata.Asset{ID: assetID}

	return s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return asset.Delete(ctx, conn, s.svc.scope)
		},
	)
}
