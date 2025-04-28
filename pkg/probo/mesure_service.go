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
	"go.gearno.de/crypto/uuid"
	"go.gearno.de/kit/pg"
)

type (
	MesureService struct {
		svc *TenantService
	}

	CreateMesureRequest struct {
		OrganizationID gid.GID
		Name           string
		Description    string
		Category       string
	}

	UpdateMesureRequest struct {
		ID          gid.GID
		Name        *string
		Description *string
		Category    *string
		State       *coredata.MesureState
	}

	ImportMesureRequest struct {
		Mesures []struct {
			Name        string `json:"name"`
			Category    string `json:"category"`
			ReferenceID string `json:"reference-id"`
			Standards   []struct {
				Framework string `json:"framework"`
				Control   string `json:"control"`
			} `json:"standards"`
			Tasks []struct {
				Name               string `json:"name"`
				Description        string `json:"description"`
				ReferenceID        string `json:"reference-id"`
				RequestedEvidences []struct {
					ReferenceID string                `json:"reference-id"`
					Type        coredata.EvidenceType `json:"type"`
					Name        string                `json:"name"`
				} `json:"requested-evidences"`
			} `json:"tasks"`
		} `json:"mesures"`
	}
)

func (s MesureService) ListForRiskID(
	ctx context.Context,
	riskID gid.GID,
	cursor *page.Cursor[coredata.MesureOrderField],
) (*page.Page[*coredata.Mesure, coredata.MesureOrderField], error) {
	var mesures coredata.Mesures

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return mesures.LoadByRiskID(ctx, conn, s.svc.scope, riskID, cursor)
		},
	)

	if err != nil {
		return nil, err
	}

	return page.NewPage(mesures, cursor), nil
}

func (s MesureService) ListForControlID(
	ctx context.Context,
	controlID gid.GID,
	cursor *page.Cursor[coredata.MesureOrderField],
) (*page.Page[*coredata.Mesure, coredata.MesureOrderField], error) {
	var mesures coredata.Mesures

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return mesures.LoadByControlID(ctx, conn, s.svc.scope, controlID, cursor)
		},
	)

	if err != nil {
		return nil, err
	}

	return page.NewPage(mesures, cursor), nil
}

func (s MesureService) Get(
	ctx context.Context,
	mesureID gid.GID,
) (*coredata.Mesure, error) {
	mesure := &coredata.Mesure{}

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return mesure.LoadByID(ctx, conn, s.svc.scope, mesureID)
		},
	)

	if err != nil {
		return nil, err
	}

	return mesure, nil
}

func (s MesureService) Import(
	ctx context.Context,
	organizationID gid.GID,
	req ImportMesureRequest,
) (*page.Page[*coredata.Mesure, coredata.MesureOrderField], error) {
	importedMesures := coredata.Mesures{}

	err := s.svc.pg.WithTx(
		ctx,
		func(tx pg.Conn) error {
			for i := range req.Mesures {
				now := time.Now()

				mesureID, err := gid.NewGID(organizationID.TenantID(), coredata.MesureEntityType)
				if err != nil {
					return fmt.Errorf("cannot create global id: %w", err)
				}

				mesure := &coredata.Mesure{
					ID:             mesureID,
					OrganizationID: organizationID,
					Name:           req.Mesures[i].Name,
					Description:    "",
					Category:       req.Mesures[i].Category,
					State:          coredata.MesureStateNotStarted,
					ReferenceID:    req.Mesures[i].ReferenceID,
					CreatedAt:      now,
					UpdatedAt:      now,
				}

				importedMesures = append(importedMesures, mesure)

				if err := mesure.Upsert(ctx, tx, s.svc.scope); err != nil {
					return fmt.Errorf("cannot upsert mesure: %w", err)
				}

				for j := range req.Mesures[i].Tasks {
					taskID, err := gid.NewGID(organizationID.TenantID(), coredata.TaskEntityType)
					if err != nil {
						return fmt.Errorf("cannot create global id: %w", err)
					}

					task := &coredata.Task{
						ID:          taskID,
						MesureID:    mesure.ID,
						Name:        req.Mesures[i].Tasks[j].Name,
						Description: req.Mesures[i].Tasks[j].Description,
						ReferenceID: req.Mesures[i].Tasks[j].ReferenceID,
						State:       coredata.TaskStateTodo,
						CreatedAt:   now,
						UpdatedAt:   now,
					}

					if err := task.Upsert(ctx, tx, s.svc.scope); err != nil {
						return fmt.Errorf("cannot upsert task: %w", err)
					}

					for k := range req.Mesures[i].Tasks[j].RequestedEvidences {
						evidenceID, err := gid.NewGID(organizationID.TenantID(), coredata.EvidenceEntityType)
						if err != nil {
							return fmt.Errorf("cannot create global id: %w", err)
						}

						evidence := &coredata.Evidence{
							State:       coredata.EvidenceStateRequested,
							ID:          evidenceID,
							TaskID:      task.ID,
							ReferenceID: req.Mesures[i].Tasks[j].RequestedEvidences[k].ReferenceID,
							Type:        req.Mesures[i].Tasks[j].RequestedEvidences[k].Type,
							Description: req.Mesures[i].Tasks[j].RequestedEvidences[k].Name,
							CreatedAt:   now,
							UpdatedAt:   now,
						}

						if err := evidence.Upsert(ctx, tx, s.svc.scope); err != nil {
							return fmt.Errorf("cannot upsert evidence: %w", err)
						}
					}
				}

				for _, standard := range req.Mesures[i].Standards {
					framework := &coredata.Framework{}
					if err := framework.LoadByReferenceID(ctx, tx, s.svc.scope, standard.Framework); err != nil {
						continue
					}

					control := &coredata.Control{}
					if err := control.LoadByFrameworkIDAndReferenceID(ctx, tx, s.svc.scope, framework.ID, standard.Control); err != nil {
						continue
					}

					controlMesure := &coredata.ControlMesure{
						ControlID: control.ID,
						MesureID:  mesure.ID,
						CreatedAt: now,
					}

					if err := controlMesure.Upsert(ctx, tx, s.svc.scope); err != nil {
						return fmt.Errorf("cannot insert control mesure: %w", err)
					}
				}
			}

			return nil
		},
	)

	if err != nil {
		return nil, fmt.Errorf("cannot import mesures: %w", err)
	}

	cursor := page.NewCursor(
		len(importedMesures),
		nil,
		page.Head,
		page.OrderBy[coredata.MesureOrderField]{
			Field:     coredata.MesureOrderFieldCreatedAt,
			Direction: page.OrderDirectionAsc,
		},
	)

	return page.NewPage(importedMesures, cursor), nil
}

func (s MesureService) Update(
	ctx context.Context,
	req UpdateMesureRequest,
) (*coredata.Mesure, error) {
	mesure := &coredata.Mesure{ID: req.ID}

	err := s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := mesure.LoadByID(ctx, conn, s.svc.scope, req.ID); err != nil {
				return fmt.Errorf("cannot load mesure: %w", err)
			}

			if req.Name != nil {
				mesure.Name = *req.Name
			}

			if req.Description != nil {
				mesure.Description = *req.Description
			}

			if req.Category != nil {
				mesure.Category = *req.Category
			}

			if req.State != nil {
				mesure.State = *req.State
			}

			mesure.UpdatedAt = time.Now()

			if err := mesure.Update(ctx, conn, s.svc.scope); err != nil {
				return fmt.Errorf("cannot update mesure: %w", err)
			}

			return nil
		},
	)
	if err != nil {
		return nil, err
	}

	return mesure, nil
}

func (s MesureService) ListForOrganizationID(
	ctx context.Context,
	organizationID gid.GID,
	cursor *page.Cursor[coredata.MesureOrderField],
) (*page.Page[*coredata.Mesure, coredata.MesureOrderField], error) {
	var mesures coredata.Mesures

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return mesures.LoadByOrganizationID(
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

	return page.NewPage(mesures, cursor), nil
}

func (s MesureService) Create(
	ctx context.Context,
	req CreateMesureRequest,
) (*coredata.Mesure, error) {
	now := time.Now()
	mesureID, err := gid.NewGID(s.svc.scope.GetTenantID(), coredata.MesureEntityType)
	if err != nil {
		return nil, fmt.Errorf("cannot create mesure global id: %w", err)
	}

	referenceID, err := uuid.NewV4()
	if err != nil {
		return nil, fmt.Errorf("cannot generate reference id: %w", err)
	}

	mesure := &coredata.Mesure{
		ID:             mesureID,
		OrganizationID: req.OrganizationID,
		Name:           req.Name,
		Description:    req.Description,
		Category:       req.Category,
		ReferenceID:    "custom-mesure-" + referenceID.String(),
		State:          coredata.MesureStateNotStarted,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	err = s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := mesure.Insert(ctx, conn, s.svc.scope); err != nil {
				return fmt.Errorf("cannot insert mesure: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return mesure, nil
}
