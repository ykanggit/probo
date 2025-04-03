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
			Name        string                        `json:"name"`
			Description string                        `json:"description"`
			Category    string                        `json:"category"`
			Importance  coredata.MitigationImportance `json:"importance"`
			ReferenceID string                        `json:"reference-id"`
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
		} `json:"mitigations"`
	}
)

func (s MitigationService) ListForRiskID(
	ctx context.Context,
	riskID gid.GID,
	cursor *page.Cursor[coredata.MitigationOrderField],
) (*page.Page[*coredata.Mitigation, coredata.MitigationOrderField], error) {
	var mitigations coredata.Mitigations

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return mitigations.LoadByRiskID(ctx, conn, s.svc.scope, riskID, cursor)
		},
	)

	if err != nil {
		return nil, err
	}

	return page.NewPage(mitigations, cursor), nil
}

func (s MitigationService) ListForControlID(
	ctx context.Context,
	controlID gid.GID,
	cursor *page.Cursor[coredata.MitigationOrderField],
) (*page.Page[*coredata.Mitigation, coredata.MitigationOrderField], error) {
	var mitigations coredata.Mitigations

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return mitigations.LoadByControlID(ctx, conn, s.svc.scope, controlID, cursor)
		},
	)

	if err != nil {
		return nil, err
	}

	return page.NewPage(mitigations, cursor), nil
}

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

	err := s.svc.pg.WithTx(
		ctx,
		func(tx pg.Conn) error {
			for i := range req.Mitigations {
				now := time.Now()

				mitigationID, err := gid.NewGID(organizationID.TenantID(), coredata.MitigationEntityType)
				if err != nil {
					return fmt.Errorf("cannot create global id: %w", err)
				}

				mitigation := &coredata.Mitigation{
					ID:             mitigationID,
					OrganizationID: organizationID,
					Name:           req.Mitigations[i].Name,
					Description:    req.Mitigations[i].Description,
					Category:       req.Mitigations[i].Category,
					State:          coredata.MitigationStateNotStarted,
					ReferenceID:    req.Mitigations[i].ReferenceID,
					Importance:     req.Mitigations[i].Importance,
					CreatedAt:      now,
					UpdatedAt:      now,
				}

				importedMitigations = append(importedMitigations, mitigation)

				if err := mitigation.Upsert(ctx, tx, s.svc.scope); err != nil {
					return fmt.Errorf("cannot upsert mitigation: %w", err)
				}

				for j := range req.Mitigations[i].Tasks {
					taskID, err := gid.NewGID(organizationID.TenantID(), coredata.TaskEntityType)
					if err != nil {
						return fmt.Errorf("cannot create global id: %w", err)
					}

					task := &coredata.Task{
						ID:           taskID,
						MitigationID: mitigation.ID,
						Name:         req.Mitigations[i].Tasks[j].Name,
						Description:  req.Mitigations[i].Tasks[j].Description,
						ReferenceID:  req.Mitigations[i].Tasks[j].ReferenceID,
						State:        coredata.TaskStateTodo,
						CreatedAt:    now,
						UpdatedAt:    now,
					}

					if err := task.Upsert(ctx, tx, s.svc.scope); err != nil {
						return fmt.Errorf("cannot upsert task: %w", err)
					}

					for k := range req.Mitigations[i].Tasks[j].RequestedEvidences {
						evidenceID, err := gid.NewGID(organizationID.TenantID(), coredata.EvidenceEntityType)
						if err != nil {
							return fmt.Errorf("cannot create global id: %w", err)
						}

						evidence := &coredata.Evidence{
							State:       coredata.EvidenceStateRequested,
							ID:          evidenceID,
							TaskID:      task.ID,
							ReferenceID: req.Mitigations[i].Tasks[j].RequestedEvidences[k].ReferenceID,
							Type:        req.Mitigations[i].Tasks[j].RequestedEvidences[k].Type,
							Description: req.Mitigations[i].Tasks[j].RequestedEvidences[k].Name,
							CreatedAt:   now,
							UpdatedAt:   now,
						}

						if err := evidence.Upsert(ctx, tx, s.svc.scope); err != nil {
							return fmt.Errorf("cannot upsert evidence: %w", err)
						}
					}
				}

				for _, standard := range req.Mitigations[i].Standards {
					framework := &coredata.Framework{}
					if err := framework.LoadByReferenceID(ctx, tx, s.svc.scope, standard.Framework); err != nil {
						continue
					}

					control := &coredata.Control{}
					if err := control.LoadByFrameworkIDAndReferenceID(ctx, tx, s.svc.scope, framework.ID, standard.Control); err != nil {
						continue
					}

					controlMitigation := &coredata.ControlMitigation{
						ControlID:    control.ID,
						MitigationID: mitigation.ID,
						CreatedAt:    now,
					}

					if err := controlMitigation.Upsert(ctx, tx, s.svc.scope); err != nil {
						return fmt.Errorf("cannot insert control mitigation: %w", err)
					}
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

	referenceID, err := uuid.NewV4()
	if err != nil {
		return nil, fmt.Errorf("cannot generate reference id: %w", err)
	}

	mitigation := &coredata.Mitigation{
		ID:             mitigationID,
		OrganizationID: req.OrganizationID,
		Name:           req.Name,
		Description:    req.Description,
		Category:       req.Category,
		ReferenceID:    "custom-mitigation-" + referenceID.String(),
		State:          coredata.MitigationStateNotStarted,
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
