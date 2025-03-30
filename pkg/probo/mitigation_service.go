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
		OrganizationID gid.GID
		Name           string
		Description    string
		Category       string
		Importance     coredata.MitigationImportance
	}

	UpdateMitigationRequest struct {
		ID          gid.GID
		Name        *string
		Description *string
		Category    *string
		State       *coredata.MitigationState
		Importance  *coredata.MitigationImportance
	}

	ImportMitigationRequest struct {
		Mitigations []struct {
			Name        string `json:"name"`
			Description string `json:"description"`
			Category    string `json:"category"`
		} `json:"mitigations"`
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

func (s MitigationService) Import(
	ctx context.Context,
	organizationID gid.GID,
	req ImportMitigationRequest,
) (*page.Page[*coredata.Mitigation, coredata.MitigationOrderField], error) {

	importedMitigations := coredata.Mitigations{}
	for _, mitigation := range req.Mitigations {
		now := time.Now()

		mitigationID, err := gid.NewGID(organizationID.TenantID(), coredata.MitigationEntityType)
		if err != nil {
			return nil, fmt.Errorf("cannot create global id: %w", err)
		}

		importedMitigations = append(importedMitigations, &coredata.Mitigation{
			ID:             mitigationID,
			OrganizationID: organizationID,
			Name:           mitigation.Name,
			Description:    mitigation.Description,
			Category:       mitigation.Category,
			State:          coredata.MitigationStateNotStarted,
			Standards:      []string{},
			Importance:     coredata.MitigationImportancePreferred,
			CreatedAt:      now,
			UpdatedAt:      now,
		})
	}

	err := s.svc.pg.WithTx(
		ctx,
		func(tx pg.Conn) error {
			for _, mitigation := range importedMitigations {
				if err := mitigation.Insert(ctx, tx, s.svc.scope); err != nil {
					return fmt.Errorf("cannot insert mitigation: %w", err)
				}
			}

			return nil
		},
	)

	if err != nil {
		return nil, fmt.Errorf("cannot import mitigations: %w", err)
	}

	cursor := page.NewCursor(
		len(importedMitigations),
		nil,
		page.Head,
		page.OrderBy[coredata.MitigationOrderField]{
			Field:     coredata.MitigationOrderFieldCreatedAt,
			Direction: page.OrderDirectionAsc,
		},
	)

	return page.NewPage(importedMitigations, cursor), nil
}

func (s MitigationService) Update(
	ctx context.Context,
	req UpdateMitigationRequest,
) (*coredata.Mitigation, error) {
	mitigation := &coredata.Mitigation{ID: req.ID}

	err := s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := mitigation.LoadByID(ctx, conn, s.svc.scope, req.ID); err != nil {
				return fmt.Errorf("cannot load mitigation: %w", err)
			}

			if req.Name != nil {
				mitigation.Name = *req.Name
			}

			if req.Description != nil {
				mitigation.Description = *req.Description
			}

			if req.Category != nil {
				mitigation.Category = *req.Category
			}

			if req.State != nil {
				mitigation.State = *req.State
			}

			if req.Importance != nil {
				mitigation.Importance = *req.Importance
			}

			mitigation.UpdatedAt = time.Now()

			if err := mitigation.Update(ctx, conn, s.svc.scope); err != nil {
				return fmt.Errorf("cannot update mitigation: %w", err)
			}

			return nil
		},
	)
	if err != nil {
		return nil, err
	}

	return mitigation, nil
}

func (s MitigationService) ListForOrganizationID(
	ctx context.Context,
	organizationID gid.GID,
	cursor *page.Cursor[coredata.MitigationOrderField],
) (*page.Page[*coredata.Mitigation, coredata.MitigationOrderField], error) {
	var mitigations coredata.Mitigations

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return mitigations.LoadByOrganizationID(
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

	mitigation := &coredata.Mitigation{
		ID:             mitigationID,
		OrganizationID: req.OrganizationID,
		Name:           req.Name,
		Description:    req.Description,
		Category:       req.Category,
		State:          coredata.MitigationStateNotStarted,
		Standards:      []string{},
		Importance:     req.Importance,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	err = s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
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
