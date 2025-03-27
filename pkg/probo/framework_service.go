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

type (
	FrameworkService struct {
		svc *TenantService
	}

	CreateFrameworkRequest struct {
		OrganizationID gid.GID
		Name           string
	}

	UpdateFrameworkRequest struct {
		ID          gid.GID
		Name        *string
		Description *string
	}

	ImportFrameworkRequest struct {
		Framework struct {
			Name     string `json:"name"`
			Controls []struct {
				ID          string `json:"id"`
				Name        string `json:"name"`
				Description string `json:"description"`
			} `json:"controls"`
		}
	}
)

func (s FrameworkService) Create(
	ctx context.Context,
	req CreateFrameworkRequest,
) (*coredata.Framework, error) {
	now := time.Now()
	frameworkID, err := gid.NewGID(s.svc.scope.GetTenantID(), coredata.FrameworkEntityType)
	if err != nil {
		return nil, fmt.Errorf("cannot create global id: %w", err)
	}

	framework := &coredata.Framework{
		ID:             frameworkID,
		OrganizationID: req.OrganizationID,
		Name:           req.Name,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	err = s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return framework.Insert(ctx, conn, s.svc.scope)
		},
	)

	if err != nil {
		return nil, err
	}

	return framework, nil
}

func (s FrameworkService) ListForOrganizationID(
	ctx context.Context,
	organizationID gid.GID,
	cursor *page.Cursor[coredata.FrameworkOrderField],
) (*page.Page[*coredata.Framework, coredata.FrameworkOrderField], error) {
	var frameworks coredata.Frameworks

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return frameworks.LoadByOrganizationID(
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

	return page.NewPage(frameworks, cursor), nil
}

func (s FrameworkService) Get(
	ctx context.Context,
	frameworkID gid.GID,
) (*coredata.Framework, error) {
	framework := &coredata.Framework{}

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return framework.LoadByID(ctx, conn, s.svc.scope, frameworkID)
		},
	)

	if err != nil {
		return nil, err
	}

	return framework, nil
}

func (s FrameworkService) Update(
	ctx context.Context,
	req UpdateFrameworkRequest,
) (*coredata.Framework, error) {
	framework := &coredata.Framework{ID: req.ID}

	err := s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := framework.LoadByID(ctx, conn, s.svc.scope, req.ID); err != nil {
				return fmt.Errorf("cannot load framework: %w", err)
			}

			if req.Name != nil {
				framework.Name = *req.Name
			}

			if req.Description != nil {
				framework.Description = *req.Description
			}

			return framework.Update(ctx, conn, s.svc.scope)
		},
	)
	if err != nil {
		return nil, err
	}

	return framework, nil
}

func (s FrameworkService) Delete(
	ctx context.Context,
	frameworkID gid.GID,
) error {
	framework := &coredata.Framework{ID: frameworkID}

	return s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return framework.Delete(ctx, conn, s.svc.scope)
		},
	)
}

func (s FrameworkService) Import(
	ctx context.Context,
	organizationID gid.GID,
	req ImportFrameworkRequest,
) (*coredata.Framework, error) {
	frameworkID, err := gid.NewGID(organizationID.TenantID(), coredata.FrameworkEntityType)
	if err != nil {
		return nil, fmt.Errorf("cannot create global id: %w", err)
	}

	now := time.Now()
	framework := &coredata.Framework{
		ID:             frameworkID,
		OrganizationID: organizationID,
		ReferenceID:    req.Framework.Name,
		Name:           req.Framework.Name,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	importedControls := coredata.Controls{}
	for _, control := range req.Framework.Controls {
		controlID, err := gid.NewGID(organizationID.TenantID(), coredata.ControlEntityType)
		if err != nil {
			return nil, fmt.Errorf("cannot create global id: %w", err)
		}

		now := time.Now()
		control := &coredata.Control{
			ID:          controlID,
			TenantID:    organizationID.TenantID(),
			FrameworkID: frameworkID,
			ReferenceID: control.ID,
			Name:        control.Name,
			Description: control.Description,
			CreatedAt:   now,
			UpdatedAt:   now,
		}

		importedControls = append(importedControls, control)
	}

	err = s.svc.pg.WithTx(
		ctx,
		func(tx pg.Conn) error {

			err := framework.Insert(ctx, tx, s.svc.scope)
			if err != nil {
				return fmt.Errorf("cannot insert framework: %w", err)
			}

			for _, importedControl := range importedControls {
				if err := importedControl.Insert(ctx, tx, s.svc.scope); err != nil {
					return fmt.Errorf("cannot insert control: %w", err)
				}
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return framework, nil
}
