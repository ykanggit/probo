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
	"maps"
	"time"

	"bytes"
	"encoding/csv"
	"encoding/json"
	"strings"

	"github.com/getprobo/probo/pkg/coredata"
	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/page"
	"github.com/jackc/pgx/v5"
	"go.gearno.de/crypto/uuid"
	"go.gearno.de/kit/pg"
)

type (
	MeasureService struct {
		svc *TenantService
	}

	CreateMeasureRequest struct {
		OrganizationID gid.GID
		Name           string
		Description    string
		Category       string
	}

	UpdateMeasureRequest struct {
		ID          gid.GID
		Name        *string
		Description *string
		Category    *string
		State       *coredata.MeasureState
	}

	ImportMeasureRequest struct {
		Measures []struct {
			Name        string  `json:"name"`
			Description *string `json:"description,omitempty"`
			Category    string  `json:"category"`
			ReferenceID string  `json:"reference-id"`
			State       *string `json:"state,omitempty"`
			Standards   []struct {
				Framework string `json:"framework"`
				Control   string `json:"control"`
			} `json:"standards"`
			Tasks []struct {
				Name               string  `json:"name"`
				Description        string  `json:"description"`
				ReferenceID        string  `json:"reference-id"`
				State              *string `json:"state,omitempty"`
				RequestedEvidences []struct {
					ReferenceID string                `json:"reference-id"`
					Type        coredata.EvidenceType `json:"type"`
					Name        string                `json:"name"`
				} `json:"requested-evidences"`
			} `json:"tasks"`
		} `json:"measures"`
	}
)

func (s MeasureService) CountForRiskID(
	ctx context.Context,
	riskID gid.GID,
	filter *coredata.MeasureFilter,
) (int, error) {
	var count int

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) (err error) {
			measures := &coredata.Measures{}
			count, err = measures.CountByRiskID(ctx, conn, s.svc.scope, riskID, filter)
			if err != nil {
				return fmt.Errorf("cannot count measures: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return 0, err
	}

	return count, nil
}
func (s MeasureService) ListForRiskID(
	ctx context.Context,
	riskID gid.GID,
	cursor *page.Cursor[coredata.MeasureOrderField],
	filter *coredata.MeasureFilter,
) (*page.Page[*coredata.Measure, coredata.MeasureOrderField], error) {
	var measures coredata.Measures
	risk := &coredata.Risk{}

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			if err := risk.LoadByID(ctx, conn, s.svc.scope, riskID); err != nil {
				return fmt.Errorf("cannot load risk: %w", err)
			}

			err := measures.LoadByRiskID(ctx, conn, s.svc.scope, risk.ID, cursor, filter)
			if err != nil {
				return fmt.Errorf("cannot load measures: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return page.NewPage(measures, cursor), nil
}

func (s MeasureService) CountForControlID(
	ctx context.Context,
	controlID gid.GID,
	filter *coredata.MeasureFilter,
) (int, error) {
	var count int

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) (err error) {
			measures := &coredata.Measures{}
			count, err = measures.CountByControlID(ctx, conn, s.svc.scope, controlID, filter)
			if err != nil {
				return fmt.Errorf("cannot count measures: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return 0, err
	}

	return count, nil
}

func (s MeasureService) ListForControlID(
	ctx context.Context,
	controlID gid.GID,
	cursor *page.Cursor[coredata.MeasureOrderField],
	filter *coredata.MeasureFilter,
) (*page.Page[*coredata.Measure, coredata.MeasureOrderField], error) {
	var measures coredata.Measures
	control := &coredata.Control{}

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			if err := control.LoadByID(ctx, conn, s.svc.scope, controlID); err != nil {
				return fmt.Errorf("cannot load control: %w", err)
			}

			err := measures.LoadByControlID(ctx, conn, s.svc.scope, control.ID, cursor, filter)
			if err != nil {
				return fmt.Errorf("cannot load measures: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return page.NewPage(measures, cursor), nil
}

func (s MeasureService) CountForOrganizationID(
	ctx context.Context,
	organizationID gid.GID,
	filter *coredata.MeasureFilter,
) (int, error) {
	var count int

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) (err error) {
			measures := &coredata.Measures{}
			count, err = measures.CountByOrganizationID(ctx, conn, s.svc.scope, organizationID, filter)
			if err != nil {
				return fmt.Errorf("cannot count measures: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return 0, err
	}

	return count, nil
}

func (s MeasureService) CountForOrganizationIDByState(
	ctx context.Context,
	organizationID gid.GID,
	state coredata.MeasureState,
	filter *coredata.MeasureFilter,
) (int, error) {
	var count int

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) (err error) {
			measures := &coredata.Measures{}
			count, err = measures.CountByOrganizationIDAndState(ctx, conn, s.svc.scope, organizationID, state, filter)
			if err != nil {
				return fmt.Errorf("cannot count measures: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return 0, err
	}

	return count, nil
}

func (s MeasureService) ListForOrganizationID(
	ctx context.Context,
	organizationID gid.GID,
	cursor *page.Cursor[coredata.MeasureOrderField],
	filter *coredata.MeasureFilter,
) (*page.Page[*coredata.Measure, coredata.MeasureOrderField], error) {
	var measures coredata.Measures
	organization := &coredata.Organization{}

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			if err := organization.LoadByID(ctx, conn, s.svc.scope, organizationID); err != nil {
				return fmt.Errorf("cannot load organization: %w", err)
			}

			err := measures.LoadByOrganizationID(
				ctx,
				conn,
				s.svc.scope,
				organization.ID,
				cursor,
				filter,
			)
			if err != nil {
				return fmt.Errorf("cannot load measures: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return page.NewPage(measures, cursor), nil
}

func (s MeasureService) Get(
	ctx context.Context,
	measureID gid.GID,
) (*coredata.Measure, error) {
	measure := &coredata.Measure{}

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return measure.LoadByID(ctx, conn, s.svc.scope, measureID)
		},
	)

	if err != nil {
		return nil, err
	}

	return measure, nil
}

type ImportResult struct {
	Measures *page.Page[*coredata.Measure, coredata.MeasureOrderField]
	Tasks    []*coredata.Task
}

func (s MeasureService) Import(
	ctx context.Context,
	organizationID gid.GID,
	req ImportMeasureRequest,
) (*ImportResult, error) {
	importedMeasures := coredata.Measures{}
	importedTasks := []*coredata.Task{}
	organization := &coredata.Organization{}

	err := s.svc.pg.WithTx(
		ctx,
		func(tx pg.Conn) error {
			if err := organization.LoadByID(ctx, tx, s.svc.scope, organizationID); err != nil {
				return fmt.Errorf("cannot load organization: %w", err)
			}

			for i := range req.Measures {
				now := time.Now()

				measureID := gid.New(organization.ID.TenantID(), coredata.MeasureEntityType)

				description := ""
				if req.Measures[i].Description != nil {
					description = *req.Measures[i].Description
				}

				// Set default state to NOT_STARTED
				state := coredata.MeasureStateNotStarted
				if req.Measures[i].State != nil {
					stateStr := *req.Measures[i].State
					switch stateStr {
					case "NOT_STARTED":
						state = coredata.MeasureStateNotStarted
					case "IN_PROGRESS":
						state = coredata.MeasureStateInProgress
					case "NOT_APPLICABLE":
						state = coredata.MeasureStateNotApplicable
					case "IMPLEMENTED":
						state = coredata.MeasureStateImplemented
					default:
						// If invalid state provided, default to NOT_STARTED
						state = coredata.MeasureStateNotStarted
					}
				}

				measure := &coredata.Measure{
					ID:             measureID,
					OrganizationID: organization.ID,
					Name:           req.Measures[i].Name,
					Description:    description,
					Category:       req.Measures[i].Category,
					State:          state,
					ReferenceID:    req.Measures[i].ReferenceID,
					CreatedAt:      now,
					UpdatedAt:      now,
				}

				importedMeasures = append(importedMeasures, measure)

				if err := measure.Upsert(ctx, tx, s.svc.scope); err != nil {
					return fmt.Errorf("cannot upsert measure: %w", err)
				}

				for j := range req.Measures[i].Tasks {
					taskID := gid.New(organization.ID.TenantID(), coredata.TaskEntityType)

					// Set default state to TODO
					state := coredata.TaskStateTodo
					if req.Measures[i].Tasks[j].State != nil {
						stateStr := *req.Measures[i].Tasks[j].State
						switch stateStr {
						case "TODO":
							state = coredata.TaskStateTodo
						case "DONE":
							state = coredata.TaskStateDone
						default:
							// If invalid state provided, default to TODO
							state = coredata.TaskStateTodo
						}
					}

					task := &coredata.Task{
						ID:             taskID,
						OrganizationID: organizationID,
						MeasureID:      &measure.ID,
						Name:           req.Measures[i].Tasks[j].Name,
						Description:    req.Measures[i].Tasks[j].Description,
						ReferenceID:    req.Measures[i].Tasks[j].ReferenceID,
						State:          state,
						CreatedAt:      now,
						UpdatedAt:      now,
					}

					if err := task.Upsert(ctx, tx, s.svc.scope); err != nil {
						return fmt.Errorf("cannot upsert task: %w", err)
					}

					importedTasks = append(importedTasks, task)

					for k := range req.Measures[i].Tasks[j].RequestedEvidences {
						evidenceID := gid.New(organizationID.TenantID(), coredata.EvidenceEntityType)

						evidence := &coredata.Evidence{
							State:       coredata.EvidenceStateRequested,
							ID:          evidenceID,
							TaskID:      &task.ID,
							ReferenceID: req.Measures[i].Tasks[j].RequestedEvidences[k].ReferenceID,
							Type:        req.Measures[i].Tasks[j].RequestedEvidences[k].Type,
							Description: req.Measures[i].Tasks[j].RequestedEvidences[k].Name,
							CreatedAt:   now,
							UpdatedAt:   now,
						}

						if err := evidence.Upsert(ctx, tx, s.svc.scope); err != nil {
							return fmt.Errorf("cannot upsert evidence: %w", err)
						}
					}
				}

				for _, standard := range req.Measures[i].Standards {
					framework := &coredata.Framework{}
					if err := framework.LoadByReferenceID(ctx, tx, s.svc.scope, standard.Framework); err != nil {
						continue
					}

					control := &coredata.Control{}
					if err := control.LoadByFrameworkIDAndSectionTitle(ctx, tx, s.svc.scope, framework.ID, standard.Control); err != nil {
						continue
					}

					controlMeasure := &coredata.ControlMeasure{
						ControlID: control.ID,
						MeasureID: measure.ID,
						CreatedAt: now,
					}

					if err := controlMeasure.Upsert(ctx, tx, s.svc.scope); err != nil {
						return fmt.Errorf("cannot insert control measure: %w", err)
					}
				}
			}

			return nil
		},
	)

	if err != nil {
		return nil, fmt.Errorf("cannot import measures: %w", err)
	}

	cursor := page.NewCursor(
		len(importedMeasures),
		nil,
		page.Head,
		page.OrderBy[coredata.MeasureOrderField]{
			Field:     coredata.MeasureOrderFieldCreatedAt,
			Direction: page.OrderDirectionAsc,
		},
	)

	return &ImportResult{
		Measures: page.NewPage(importedMeasures, cursor),
		Tasks:    importedTasks,
	}, nil
}

func (s MeasureService) Update(
	ctx context.Context,
	req UpdateMeasureRequest,
) (*coredata.Measure, error) {
	measure := &coredata.Measure{ID: req.ID}

	err := s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := measure.LoadByID(ctx, conn, s.svc.scope, req.ID); err != nil {
				return fmt.Errorf("cannot load measure: %w", err)
			}

			if req.Name != nil {
				measure.Name = *req.Name
			}

			if req.Description != nil {
				measure.Description = *req.Description
			}

			if req.Category != nil {
				measure.Category = *req.Category
			}

			if req.State != nil {
				measure.State = *req.State
			}

			measure.UpdatedAt = time.Now()

			if err := measure.Update(ctx, conn, s.svc.scope); err != nil {
				return fmt.Errorf("cannot update measure: %w", err)
			}

			return nil
		},
	)
	if err != nil {
		return nil, err
	}

	return measure, nil
}

func (s MeasureService) Create(
	ctx context.Context,
	req CreateMeasureRequest,
) (*coredata.Measure, error) {
	now := time.Now()
	var measure *coredata.Measure
	organization := &coredata.Organization{}

	referenceID, err := uuid.NewV4()
	if err != nil {
		return nil, fmt.Errorf("cannot generate reference id: %w", err)
	}

	err = s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := organization.LoadByID(ctx, conn, s.svc.scope, req.OrganizationID); err != nil {
				return fmt.Errorf("cannot load organization: %w", err)
			}

			measure = &coredata.Measure{
				ID:             gid.New(organization.ID.TenantID(), coredata.MeasureEntityType),
				OrganizationID: organization.ID,
				Name:           req.Name,
				Description:    req.Description,
				Category:       req.Category,
				ReferenceID:    "custom-measure-" + referenceID.String(),
				State:          coredata.MeasureStateNotStarted,
				CreatedAt:      now,
				UpdatedAt:      now,
			}

			if err := measure.Insert(ctx, conn, s.svc.scope); err != nil {
				return fmt.Errorf("cannot insert measure: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return measure, nil
}

func (s MeasureService) Delete(
	ctx context.Context,
	measureID gid.GID,
) ([]gid.GID, error) {
	var deletedTaskIDs []gid.GID

	err := s.svc.pg.WithTx(ctx, func(conn pg.Conn) error {
		// First, delete all tasks associated with this measure
		// Use a simple query to get all tasks for this measure
		q := `
		SELECT
			id,
			measure_id,
			organization_id,
			name,
			description,
			state,
			reference_id,
			time_estimate,
			assigned_to,
			deadline,
			created_at,
			updated_at
		FROM
			tasks
		WHERE
			%s
			AND measure_id = @measure_id
		`
		q = fmt.Sprintf(q, s.svc.scope.SQLFragment())

		args := pgx.StrictNamedArgs{"measure_id": measureID}
		maps.Copy(args, s.svc.scope.SQLArguments())

		rows, err := conn.Query(ctx, q, args)
		if err != nil {
			return fmt.Errorf("cannot query tasks for measure: %w", err)
		}

		tasks, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[coredata.Task])
		if err != nil {
			return fmt.Errorf("cannot collect tasks: %w", err)
		}

		// Collect task IDs before deleting them
		for _, task := range tasks {
			deletedTaskIDs = append(deletedTaskIDs, task.ID)
		}

		// Delete each task
		for _, task := range tasks {
			if err := task.Delete(ctx, conn, s.svc.scope); err != nil {
				return fmt.Errorf("cannot delete task %s: %w", task.ID, err)
			}
		}

		// Then delete the measure
		measure := &coredata.Measure{}
		if err := measure.Delete(ctx, conn, s.svc.scope, measureID); err != nil {
			return fmt.Errorf("cannot delete measure: %w", err)
		}

		return nil
	})

	return deletedTaskIDs, err
}

func (s MeasureService) Export(
	ctx context.Context,
	organizationID gid.GID,
	scope string,
	format string,
) (string, error) {
	var buf bytes.Buffer
	measures := coredata.Measures{}

	err := s.svc.pg.WithConn(ctx, func(conn pg.Conn) error {
		// Fetch all measures for the organization
		cursor := page.NewCursor(10000, nil, page.Head, page.OrderBy[coredata.MeasureOrderField]{
			Field:     coredata.MeasureOrderFieldCreatedAt,
			Direction: page.OrderDirectionAsc,
		})
		if err := measures.LoadByOrganizationID(ctx, conn, s.svc.scope, organizationID, cursor, coredata.NewMeasureFilter(nil)); err != nil {
			return err
		}

		if strings.ToLower(format) == "csv" {
			w := csv.NewWriter(&buf)
			w.Write([]string{"CONTROL", "TITLE", "DESCRIPTION", "STATE", "IMPLEMENTATION DETAILS"})
			for _, m := range measures {
				controls := coredata.Controls{}
				if err := controls.LoadByMeasureID(ctx, conn, s.svc.scope, m.ID, page.NewCursor(10, nil, page.Head, page.OrderBy[coredata.ControlOrderField]{Field: coredata.ControlOrderFieldCreatedAt, Direction: page.OrderDirectionAsc}), coredata.NewControlFilter(nil)); err != nil {
					return err
				}
				controlRef := ""
				if len(controls) > 0 {
					controlRef = controls[0].SectionTitle
				}
				tasks := coredata.Tasks{}
				if err := tasks.LoadByMeasureID(ctx, conn, s.svc.scope, m.ID, page.NewCursor(10, nil, page.Head, page.OrderBy[coredata.TaskOrderField]{Field: coredata.TaskOrderFieldCreatedAt, Direction: page.OrderDirectionAsc})); err != nil {
					return err
				}
				implDetails := ""
				if len(tasks) > 0 {
					implDetails = tasks[0].Description
				}
				w.Write([]string{controlRef, m.Name, m.Description, m.State.String(), implDetails})
			}
			w.Flush()
			return w.Error()
		} else if strings.ToLower(format) == "json" {

			type ExportedMeasure struct {
				Name        string `json:"name"`
				Description string `json:"description"`
				Category    string `json:"category"`
				ReferenceID string `json:"reference-id"`
				State       string `json:"state"`
				Standards   []struct {
					Framework string `json:"framework"`
					Control   string `json:"control"`
				} `json:"standards"`
				Tasks []struct {
					Name        string `json:"name"`
					Description string `json:"description"`
					ReferenceID string `json:"reference-id"`
					State       string `json:"state"`
				} `json:"tasks"`
			}
			var exported []ExportedMeasure
			for _, m := range measures {
				controls := coredata.Controls{}
				if err := controls.LoadByMeasureID(ctx, conn, s.svc.scope, m.ID, page.NewCursor(10, nil, page.Head, page.OrderBy[coredata.ControlOrderField]{Field: coredata.ControlOrderFieldCreatedAt, Direction: page.OrderDirectionAsc}), coredata.NewControlFilter(nil)); err != nil {
					return err
				}
				standards := make([]struct {
					Framework string `json:"framework"`
					Control   string `json:"control"`
				}, len(controls))
				for i, c := range controls {
					standards[i].Framework = ""
					standards[i].Control = c.SectionTitle
				}
				tasks := coredata.Tasks{}
				if err := tasks.LoadByMeasureID(ctx, conn, s.svc.scope, m.ID, page.NewCursor(100, nil, page.Head, page.OrderBy[coredata.TaskOrderField]{Field: coredata.TaskOrderFieldCreatedAt, Direction: page.OrderDirectionAsc})); err != nil {
					return err
				}
				exportedTasks := make([]struct {
					Name        string `json:"name"`
					Description string `json:"description"`
					ReferenceID string `json:"reference-id"`
					State       string `json:"state"`
				}, len(tasks))
				for i, t := range tasks {
					exportedTasks[i].Name = t.Name
					exportedTasks[i].Description = t.Description
					exportedTasks[i].ReferenceID = t.ReferenceID
					exportedTasks[i].State = t.State.String()
				}
				exported = append(exported, ExportedMeasure{
					Name:        m.Name,
					Description: m.Description,
					Category:    m.Category,
					ReferenceID: m.ReferenceID,
					State:       m.State.String(),
					Standards:   standards,
					Tasks:       exportedTasks,
				})
			}
			enc := json.NewEncoder(&buf)
			enc.SetIndent("", "  ")
			return enc.Encode(map[string]any{"measures": exported})
		}
		return fmt.Errorf("unsupported format: %s", format)
	})
	if err != nil {
		return "", err
	}

	// Upload to S3/MinIO
	// s3Client := s.svc.s3Client
	// bucket := s.svc.cfg.AWS.Bucket
	// key := fmt.Sprintf("exports/measures-%s-%d.%s", organizationID.String(), time.Now().Unix(), strings.ToLower(format))
	// uploader := s3manager.NewUploader(s3Client)
	// _, err = uploader.Upload(ctx, &s3.PutObjectInput{
	// 	Bucket:      aws.String(bucket),
	// 	Key:         aws.String(key),
	// 	Body:        bytes.NewReader(buf.Bytes()),
	// 	ContentType: aws.String(map[string]string{"csv": "text/csv", "json": "application/json"}[strings.ToLower(format)]),
	// })
	// if err != nil {
	// 	return "", fmt.Errorf("failed to upload export: %w", err)
	// }

	// Generate a presigned URL
	// presignClient := s3.NewPresignClient(s3Client)
	// presigned, err := presignClient.PresignGetObject(ctx, &s3.GetObjectInput{
	// 	Bucket: aws.String(bucket),
	// 	Key:    aws.String(key),
	// }, s3.WithPresignExpires(10*time.Minute))
	// if err != nil {
	// 	return "", fmt.Errorf("failed to presign export: %w", err)
	// }

	// return presigned.URL, nil
	return "", fmt.Errorf("S3/MinIO export is not implemented")
}

// ExportAll exports all measures for an organization as CSV or JSON for direct download
func (s MeasureService) ExportAll(
	ctx context.Context,
	organizationID gid.GID,
	format string,
) ([]byte, string, error) {
	var measures coredata.Measures
	err := s.svc.pg.WithConn(ctx, func(conn pg.Conn) error {
		// Create an empty filter and a cursor that loads all records
		filter := &coredata.MeasureFilter{}
		cursor := page.NewCursor(10000, nil, page.Head, page.OrderBy[coredata.MeasureOrderField]{
			Field:     coredata.MeasureOrderFieldCreatedAt,
			Direction: page.OrderDirectionAsc,
		})
		return measures.LoadByOrganizationID(ctx, conn, s.svc.scope, organizationID, cursor, filter)
	})
	if err != nil {
		return nil, "", err
	}

	switch format {
	case "csv":
		var buf bytes.Buffer
		w := csv.NewWriter(&buf)
		w.Write([]string{"CONTROL", "TITLE", "DESCRIPTION", "STATE", "IMPLEMENTATION DETAILS"})
		for _, m := range measures {
			var controls coredata.Controls
			err := s.svc.pg.WithConn(ctx, func(conn pg.Conn) error {
				// Create proper cursor and filter for controls
				cursor := page.NewCursor(100, nil, page.Head, page.OrderBy[coredata.ControlOrderField]{
					Field:     coredata.ControlOrderFieldCreatedAt,
					Direction: page.OrderDirectionAsc,
				})
				filter := &coredata.ControlFilter{}
				return controls.LoadByMeasureID(ctx, conn, s.svc.scope, m.ID, cursor, filter)
			})
			if err != nil {
				return nil, "", err
			}
			controlRef := ""
			if len(controls) > 0 {
				controlRef = controls[0].SectionTitle
			}
			var tasks coredata.Tasks
			err = s.svc.pg.WithConn(ctx, func(conn pg.Conn) error {
				// Create proper cursor for tasks
				cursor := page.NewCursor(100, nil, page.Head, page.OrderBy[coredata.TaskOrderField]{
					Field:     coredata.TaskOrderFieldCreatedAt,
					Direction: page.OrderDirectionAsc,
				})
				return tasks.LoadByMeasureID(ctx, conn, s.svc.scope, m.ID, cursor)
			})
			if err != nil {
				return nil, "", err
			}
			implDetails := ""
			if len(tasks) > 0 {
				implDetails = tasks[0].Description
			}
			w.Write([]string{
				controlRef,
				m.Name,
				m.Description,
				m.State.String(),
				implDetails,
			})
		}
		w.Flush()
		filename := "measures-export-" + time.Now().Format("2006-01-02") + ".csv"
		return buf.Bytes(), filename, nil
	case "json":
		type ExportedMeasure struct {
			Name        string `json:"name"`
			Description string `json:"description"`
			Category    string `json:"category"`
			ReferenceID string `json:"reference-id"`
			State       string `json:"state"`
			Standards   []struct {
				Framework string `json:"framework"`
				Control   string `json:"control"`
			} `json:"standards"`
			Tasks []struct {
				Name        string `json:"name"`
				Description string `json:"description"`
				ReferenceID string `json:"reference-id"`
				State       string `json:"state"`
			} `json:"tasks"`
		}
		exportData := struct {
			Measures []ExportedMeasure `json:"measures"`
		}{Measures: []ExportedMeasure{}}
		for _, m := range measures {
			var controls coredata.Controls
			err := s.svc.pg.WithConn(ctx, func(conn pg.Conn) error {
				// Create proper cursor and filter for controls
				cursor := page.NewCursor(100, nil, page.Head, page.OrderBy[coredata.ControlOrderField]{
					Field:     coredata.ControlOrderFieldCreatedAt,
					Direction: page.OrderDirectionAsc,
				})
				filter := &coredata.ControlFilter{}
				return controls.LoadByMeasureID(ctx, conn, s.svc.scope, m.ID, cursor, filter)
			})
			if err != nil {
				return nil, "", err
			}
			var tasks coredata.Tasks
			err = s.svc.pg.WithConn(ctx, func(conn pg.Conn) error {
				// Create proper cursor for tasks
				cursor := page.NewCursor(100, nil, page.Head, page.OrderBy[coredata.TaskOrderField]{
					Field:     coredata.TaskOrderFieldCreatedAt,
					Direction: page.OrderDirectionAsc,
				})
				return tasks.LoadByMeasureID(ctx, conn, s.svc.scope, m.ID, cursor)
			})
			if err != nil {
				return nil, "", err
			}
			em := ExportedMeasure{
				Name:        m.Name,
				Description: m.Description,
				Category:    m.Category,
				ReferenceID: m.ReferenceID,
				State:       m.State.String(),
			}
			for _, c := range controls {
				// Load the framework to get the actual framework name
				var framework coredata.Framework
				err := s.svc.pg.WithConn(ctx, func(conn pg.Conn) error {
					return framework.LoadByID(ctx, conn, s.svc.scope, c.FrameworkID)
				})
				if err != nil {
					return nil, "", err
				}

				em.Standards = append(em.Standards, struct {
					Framework string `json:"framework"`
					Control   string `json:"control"`
				}{
					Framework: framework.Name,
					Control:   c.SectionTitle,
				})
			}
			for _, t := range tasks {
				em.Tasks = append(em.Tasks, struct {
					Name        string `json:"name"`
					Description string `json:"description"`
					ReferenceID string `json:"reference-id"`
					State       string `json:"state"`
				}{
					Name:        t.Name,
					Description: t.Description,
					ReferenceID: t.ReferenceID,
					State:       t.State.String(),
				})
			}
			exportData.Measures = append(exportData.Measures, em)
		}
		jsonBytes, err := json.MarshalIndent(exportData, "", "  ")
		if err != nil {
			return nil, "", err
		}
		filename := "measures-export-" + time.Now().Format("2006-01-02") + ".json"
		return jsonBytes, filename, nil
	default:
		return nil, "", fmt.Errorf("unsupported format: %s", format)
	}
}
