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
	TaskService struct {
		svc *TenantService
	}

	CreateTaskRequest struct {
		OrganizationID gid.GID
		MeasureID      *gid.GID
		Name           string
		Description    string
		TimeEstimate   *time.Duration
		AssignedToID   *gid.GID
		Deadline       *time.Time
	}

	UpdateTaskRequest struct {
		TaskID       gid.GID
		Name         *string
		Description  *string
		State        *coredata.TaskState
		TimeEstimate *time.Duration
		Deadline     *time.Time
	}
)

func (s TaskService) Create(
	ctx context.Context,
	req CreateTaskRequest,
) (*coredata.Task, error) {
	now := time.Now()
	taskID := gid.New(s.svc.scope.GetTenantID(), coredata.TaskEntityType)

	referenceID, err := uuid.NewV4()
	if err != nil {
		return nil, fmt.Errorf("cannot generate reference id: %w", err)
	}

	task := &coredata.Task{
		ID:             taskID,
		OrganizationID: req.OrganizationID,
		MeasureID:      req.MeasureID,
		Name:           req.Name,
		Description:    req.Description,
		TimeEstimate:   req.TimeEstimate,
		AssignedToID:   req.AssignedToID,
		Deadline:       req.Deadline,
		State:          coredata.TaskStateTodo,
		ReferenceID:    "custom-task-" + referenceID.String(),
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	err = s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {

			if err := task.Insert(ctx, conn, s.svc.scope); err != nil {
				return fmt.Errorf("cannot insert task: %w", err)
			}

			return nil
		},
	)
	if err != nil {
		return nil, fmt.Errorf("cannot create task: %w", err)
	}

	return task, nil
}

func (s TaskService) Get(
	ctx context.Context,
	taskID gid.GID,
) (*coredata.Task, error) {
	task := &coredata.Task{}

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return task.LoadByID(ctx, conn, s.svc.scope, taskID)
		},
	)
	if err != nil {
		return nil, err
	}

	return task, nil
}

func (s TaskService) Assign(
	ctx context.Context,
	taskID gid.GID,
	assignedToID gid.GID,
) (*coredata.Task, error) {
	task := &coredata.Task{ID: taskID}

	err := s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := task.LoadByID(ctx, conn, s.svc.scope, taskID); err != nil {
				return fmt.Errorf("cannot load task %q: %w", taskID, err)
			}

			task.AssignedToID = &assignedToID
			task.UpdatedAt = time.Now()

			if err := task.Update(ctx, conn, s.svc.scope); err != nil {
				return fmt.Errorf("cannot assign task %q to %q: %w", taskID, assignedToID, err)
			}

			return nil
		},
	)
	if err != nil {
		return nil, err
	}

	return task, nil
}

func (s TaskService) Unassign(
	ctx context.Context,
	taskID gid.GID,
) (*coredata.Task, error) {
	task := &coredata.Task{}

	err := s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := task.LoadByID(ctx, conn, s.svc.scope, taskID); err != nil {
				return fmt.Errorf("cannot load task %q: %w", taskID, err)
			}

			task.AssignedToID = nil
			task.UpdatedAt = time.Now()

			if err := task.Update(ctx, conn, s.svc.scope); err != nil {
				return fmt.Errorf("cannot unassign task %q: %w", taskID, err)
			}

			return nil
		},
	)
	if err != nil {
		return nil, err
	}

	return task, nil
}

func (s TaskService) Update(
	ctx context.Context,
	req UpdateTaskRequest,
) (*coredata.Task, error) {

	task := &coredata.Task{}

	err := s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := task.LoadByID(ctx, conn, s.svc.scope, req.TaskID); err != nil {
				return fmt.Errorf("cannot load task %q: %w", req.TaskID, err)
			}

			if req.Name != nil {
				task.Name = *req.Name
			}

			if req.Description != nil {
				task.Description = *req.Description
			}

			if req.State != nil {
				task.State = *req.State
			}

			if req.TimeEstimate != nil {
				task.TimeEstimate = req.TimeEstimate
			}

			if req.Deadline != nil {
				task.Deadline = req.Deadline
			}

			task.UpdatedAt = time.Now()

			if err := task.Update(ctx, conn, s.svc.scope); err != nil {
				return fmt.Errorf("cannot update task: %w", err)
			}

			return nil
		},
	)
	if err != nil {
		return nil, err
	}

	return task, nil
}

func (s TaskService) Delete(
	ctx context.Context,
	taskID gid.GID,
) error {
	task := &coredata.Task{ID: taskID}

	err := s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			return task.Delete(ctx, conn, s.svc.scope)
		},
	)
	if err != nil {
		return err
	}

	return nil
}

func (s TaskService) CountForOrganizationID(
	ctx context.Context,
	organizationID gid.GID,
) (int, error) {
	var count int

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) (err error) {
			tasks := coredata.Tasks{}
			count, err = tasks.CountByOrganizationID(ctx, conn, s.svc.scope, organizationID)
			if err != nil {
				return fmt.Errorf("cannot count tasks: %w", err)
			}

			return nil
		},
	)
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (s TaskService) CountForOrganizationIDByState(
	ctx context.Context,
	organizationID gid.GID,
	state coredata.TaskState,
) (int, error) {
	var count int

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) (err error) {
			tasks := coredata.Tasks{}
			count, err = tasks.CountByOrganizationIDAndState(ctx, conn, s.svc.scope, organizationID, state)
			if err != nil {
				return fmt.Errorf("cannot count tasks: %w", err)
			}

			return nil
		},
	)
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (s TaskService) ListForOrganizationID(
	ctx context.Context,
	organizationID gid.GID,
	cursor *page.Cursor[coredata.TaskOrderField],
) (*page.Page[*coredata.Task, coredata.TaskOrderField], error) {
	var tasks coredata.Tasks

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return tasks.LoadByOrganizationID(ctx, conn, s.svc.scope, organizationID, cursor)
		},
	)
	if err != nil {
		return nil, err
	}

	return page.NewPage(tasks, cursor), nil
}

func (s TaskService) CountForMeasureID(
	ctx context.Context,
	measureID gid.GID,
) (int, error) {
	var count int

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) (err error) {
			tasks := coredata.Tasks{}
			count, err = tasks.CountByMeasureID(ctx, conn, s.svc.scope, measureID)
			if err != nil {
				return fmt.Errorf("cannot count tasks: %w", err)
			}

			return nil
		},
	)
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (s TaskService) ListForMeasureID(
	ctx context.Context,
	measureID gid.GID,
	cursor *page.Cursor[coredata.TaskOrderField],
) (*page.Page[*coredata.Task, coredata.TaskOrderField], error) {
	var tasks coredata.Tasks

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return tasks.LoadByMeasureID(
				ctx,
				conn,
				s.svc.scope,
				measureID,
				cursor,
			)
		},
	)
	if err != nil {
		return nil, err
	}

	return page.NewPage(tasks, cursor), nil
}
