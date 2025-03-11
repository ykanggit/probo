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
	"go.gearno.de/kit/pg"
)

type (
	OrganizationService struct {
		svc *TenantService
	}

	CreateOrganizationRequest struct {
		Name string
	}
)

func (s OrganizationService) Create(
	ctx context.Context,
	req CreateOrganizationRequest,
) (*coredata.Organization, error) {
	now := time.Now()
	organizationID, err := gid.NewGID(s.svc.scope.GetTenantID(), coredata.OrganizationEntityType)
	if err != nil {
		return nil, fmt.Errorf("cannot create organization global id: %w", err)
	}

	organization := &coredata.Organization{
		ID:        organizationID,
		TenantID:  s.svc.scope.GetTenantID(),
		Name:      req.Name,
		CreatedAt: now,
		UpdatedAt: now,
	}

	err = s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			if err := organization.Insert(ctx, conn); err != nil {
				return fmt.Errorf("cannot insert control: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return organization, nil
}

func (s OrganizationService) Get(
	ctx context.Context,
	organizationID gid.GID,
) (*coredata.Organization, error) {
	organization := &coredata.Organization{}

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return organization.LoadByID(
				ctx,
				conn,
				s.svc.scope,
				organizationID,
			)
		},
	)

	if err != nil {
		return nil, err
	}

	return organization, nil
}
