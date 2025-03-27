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
	MitigationService struct {
		svc *TenantService
	}

	CreateMitigationRequest struct {
		FrameworkID gid.GID
		Name        string
		Description string
		Category    string
		Importance  coredata.MitigationImportance
	}

	UpdateMitigationRequest struct {
		ID              gid.GID
		ExpectedVersion int
		Name            *string
		Description     *string
		Category        *string
		State           *coredata.MitigationState
		Importance      *coredata.MitigationImportance
	}
)

func (s MitigationService) Get(
	ctx context.Context,
	mitigationID gid.GID,
) (*coredata.Mitigation, error) {
	mitigation := &coredata.Mitigation{}

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return mitigation.LoadByID(ctx, conn, s.svc.scope, mitigationID)
		},
	)

	if err != nil {
		return nil, err
	}

	return mitigation, nil
}

func (s MitigationService) Update(
	ctx context.Context,
	req UpdateMitigationRequest,
) (*coredata.Mitigation, error) {
	params := coredata.UpdateMitigationParams{
		ExpectedVersion: req.ExpectedVersion,
		Name:            req.Name,
		Description:     req.Description,
		Category:        req.Category,
		State:           req.State,
		Importance:      req.Importance,
	}

	mitigation := &coredata.Mitigation{ID: req.ID}

	err := s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			return mitigation.Update(ctx, conn, s.svc.scope, params)
		})
	if err != nil {
		return nil, err
	}

	return mitigation, nil
}

func (s MitigationService) ListForFrameworkID(
	ctx context.Context,
	frameworkID gid.GID,
	cursor *page.Cursor[coredata.MitigationOrderField],
) (*page.Page[*coredata.Mitigation, coredata.MitigationOrderField], error) {
	var mitigations coredata.Mitigations

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return mitigations.LoadByFrameworkID(
				ctx,
				conn,
				s.svc.scope,
				frameworkID,
				cursor,
			)
		},
	)

	if err != nil {
		return nil, err
	}

	return page.NewPage(mitigations, cursor), nil
}

func (s MitigationService) Create(
	ctx context.Context,
	req CreateMitigationRequest,
) (*coredata.Mitigation, error) {
	now := time.Now()
	mitigationID, err := gid.NewGID(s.svc.scope.GetTenantID(), coredata.MitigationEntityType)
	if err != nil {
		return nil, fmt.Errorf("cannot create mitigation global id: %w", err)
	}

	framework := &coredata.Framework{}
	mitigation := &coredata.Mitigation{
		ID:          mitigationID,
		FrameworkID: req.FrameworkID,
		Name:        req.Name,
		Description: req.Description,
		Category:    req.Category,
		State:       coredata.MitigationStateNotStarted,
		Standards:   []string{},
		Importance:  req.Importance,
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	err = s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := framework.LoadByID(ctx, conn, s.svc.scope, req.FrameworkID); err != nil {
				return fmt.Errorf("cannot load framework %q: %w", req.FrameworkID, err)
			}

			if err := mitigation.Insert(ctx, conn, s.svc.scope); err != nil {
				return fmt.Errorf("cannot insert mitigation: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return mitigation, nil
}
