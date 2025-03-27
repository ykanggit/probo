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

	"gearno.de/ref"
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
		Description    string
		ContentRef     string
	}

	UpdateFrameworkRequest struct {
		ID              gid.GID
		ExpectedVersion int
		Name            *string
		Description     *string
	}

	ImportFrameworkRequest struct {
		Data struct {
			Framework struct {
				Name        string `json:"name"`
				ContentRef  string `json:"content-ref"`
				Description string `json:"description"`
				Version     string `json:"version"`
				Controls    []struct {
					ContentRef  string                        `json:"content-ref"`
					Category    string                        `json:"category"`
					Importance  coredata.MitigationImportance `json:"importance"`
					Standards   []string                      `json:"standards"`
					Name        string                        `json:"name"`
					Description string                        `json:"description"`
					Tasks       []struct {
						Name         string `json:"name"`
						Description  string `json:"description"`
						TimeEstimate int    `json:"time-estimate"`
					} `json:"tasks"`
				} `json:"controls"`
			} `json:"framework"`
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
		Description:    req.Description,
		ContentRef:     req.ContentRef,
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
	params := coredata.UpdateFrameworkParams{
		ExpectedVersion: req.ExpectedVersion,
		Name:            req.Name,
		Description:     req.Description,
	}

	framework := &coredata.Framework{ID: req.ID}

	err := s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			return framework.Update(ctx, conn, s.svc.scope, params)
		})
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

	now := time.Now()

	frameworkID, err := gid.NewGID(organizationID.TenantID(), coredata.FrameworkEntityType)
	if err != nil {
		return nil, fmt.Errorf("cannot create global id: %w", err)
	}

	framework := &coredata.Framework{
		ID:             frameworkID,
		OrganizationID: organizationID,
		Name:           req.Data.Framework.Name,
		Description:    req.Data.Framework.Description,
		ContentRef:     req.Data.Framework.ContentRef,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	importedMitigations := coredata.Mitigations{}
	importedTasks := coredata.Tasks{}
	for _, mitigation := range req.Data.Framework.Controls {
		controlID, err := gid.NewGID(organizationID.TenantID(), coredata.MitigationEntityType)
		if err != nil {
			return nil, fmt.Errorf("cannot create global id: %w", err)
		}

		importedControl := &coredata.Mitigation{
			ID:          controlID,
			FrameworkID: frameworkID,
			Category:    mitigation.Category,
			Importance:  coredata.MitigationImportance(mitigation.Importance),
			Name:        mitigation.Name,
			Description: mitigation.Description,
			State:       coredata.MitigationStateNotStarted,
			ContentRef:  mitigation.ContentRef,
			CreatedAt:   now,
			UpdatedAt:   now,
			Standards:   mitigation.Standards,
		}

		importedMitigations = append(importedMitigations, importedControl)

		for _, task := range mitigation.Tasks {
			taskID, err := gid.NewGID(organizationID.TenantID(), coredata.TaskEntityType)
			if err != nil {
				return nil, fmt.Errorf("cannot create global id: %w", err)
			}

			var timeEstimate *time.Duration
			if task.TimeEstimate > 0 {
				timeEstimate = ref.Ref(time.Duration(task.TimeEstimate) * time.Second)
			}

			importedTasks = append(importedTasks, &coredata.Task{
				ID:           taskID,
				MitigationID: controlID,
				Name:         task.Name,
				State:        coredata.TaskStateTodo,
				Description:  task.Description,
				CreatedAt:    now,
				UpdatedAt:    now,
				TimeEstimate: timeEstimate,
			})
		}
	}

	err = s.svc.pg.WithTx(
		ctx,
		func(tx pg.Conn) error {

			err := framework.Insert(ctx, tx, s.svc.scope)
			if err != nil {
				return fmt.Errorf("cannot insert framework: %w", err)
			}

			for _, importedMitigation := range importedMitigations {
				if err := importedMitigation.Insert(ctx, tx, s.svc.scope); err != nil {
					return fmt.Errorf("cannot insert mitigation: %w", err)
				}
			}

			for _, importedTask := range importedTasks {
				if err := importedTask.Insert(ctx, tx, s.svc.scope); err != nil {
					return fmt.Errorf("cannot insert task: %w", err)
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
