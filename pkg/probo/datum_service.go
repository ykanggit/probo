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

	"github.com/getprobo/probo/pkg/coredata"
	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/page"
	"go.gearno.de/kit/pg"
)

type DatumService struct {
	svc *TenantService
}

type CreateDatumRequest struct {
	OrganizationID     gid.GID
	Name               string
	DataClassification coredata.DataClassification
	OwnerID            gid.GID
	VendorIDs          []gid.GID
}

type UpdateDatumRequest struct {
	ID                 gid.GID
	Name               *string
	DataClassification *coredata.DataClassification
	OwnerID            *gid.GID
	VendorIDs          []gid.GID
}

func (s DatumService) Get(
	ctx context.Context,
	datumID gid.GID,
) (*coredata.Datum, error) {
	datum := &coredata.Datum{}

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return datum.LoadByID(ctx, conn, s.svc.scope, datumID)
		},
	)

	if err != nil {
		return nil, err
	}

	return datum, nil
}

func (s DatumService) GetByOwnerID(
	ctx context.Context,
	ownerID gid.GID,
) (*coredata.Datum, error) {
	datum := &coredata.Datum{OwnerID: ownerID}

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return datum.LoadByOwnerID(ctx, conn, s.svc.scope)
		},
	)

	if err != nil {
		return nil, err
	}

	return datum, nil
}

func (s DatumService) CountForOrganizationID(
	ctx context.Context,
	organizationID gid.GID,
) (int, error) {
	var count int

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) (err error) {
			data := coredata.Data{}
			count, err = data.CountByOrganizationID(ctx, conn, s.svc.scope, organizationID)
			if err != nil {
				return fmt.Errorf("cannot count data: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return 0, err
	}

	return count, nil
}

func (s DatumService) ListForOrganizationID(
	ctx context.Context,
	organizationID gid.GID,
	cursor *page.Cursor[coredata.DatumOrderField],
) (*page.Page[*coredata.Datum, coredata.DatumOrderField], error) {
	var data coredata.Data

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return data.LoadByOrganizationID(
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

	return page.NewPage(data, cursor), nil
}

func (s DatumService) Update(
	ctx context.Context,
	req UpdateDatumRequest,
) (*coredata.Datum, error) {
	now := time.Now()

	existing := &coredata.Datum{}
	if err := s.svc.pg.WithConn(ctx, func(conn pg.Conn) error {
		return existing.LoadByID(ctx, conn, s.svc.scope, req.ID)
	}); err != nil {
		return nil, fmt.Errorf("cannot load data: %w", err)
	}

	datum := &coredata.Datum{
		ID:                 req.ID,
		OrganizationID:     existing.OrganizationID,
		Name:               existing.Name,
		DataClassification: existing.DataClassification,
		OwnerID:            existing.OwnerID,
		CreatedAt:          existing.CreatedAt,
		UpdatedAt:          now,
	}

	// Update fields from request
	if req.Name != nil {
		datum.Name = *req.Name
	}
	if req.DataClassification != nil {
		datum.DataClassification = *req.DataClassification
	}
	if req.OwnerID != nil {
		datum.OwnerID = *req.OwnerID
	}

	if err := datum.UpdateWithVendorsTx(ctx, s.svc.pg, s.svc.scope, req.VendorIDs, now); err != nil {
		return nil, err
	}

	return datum, nil
}

func (s DatumService) Create(
	ctx context.Context,
	req CreateDatumRequest,
) (*coredata.Datum, error) {
	now := time.Now()
	datumID := gid.New(s.svc.scope.GetTenantID(), coredata.DatumEntityType)

	datum := &coredata.Datum{
		ID:                 datumID,
		OrganizationID:     req.OrganizationID,
		Name:               req.Name,
		DataClassification: req.DataClassification,
		OwnerID:            req.OwnerID,
		CreatedAt:          now,
		UpdatedAt:          now,
	}

	err := s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			return datum.CreateWithVendors(ctx, conn, s.svc.scope, req.VendorIDs, now)
		},
	)

	if err != nil {
		return nil, err
	}

	return datum, nil
}

func (s DatumService) Delete(
	ctx context.Context,
	datumID gid.GID,
) error {
	datum := &coredata.Datum{ID: datumID}

	return s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return datum.Delete(ctx, conn, s.svc.scope)
		},
	)
}

func (s DatumService) ListVendors(
	ctx context.Context,
	datumID gid.GID,
	cursor *page.Cursor[coredata.VendorOrderField],
) (*page.Page[*coredata.Vendor, coredata.VendorOrderField], error) {
	var vendors coredata.Vendors

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return vendors.LoadByDatumID(ctx, conn, s.svc.scope, datumID, cursor)
		},
	)

	if err != nil {
		return nil, err
	}

	return page.NewPage(vendors, cursor), nil
}
