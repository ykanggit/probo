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
	"errors"
	"fmt"
	"time"

	"github.com/getprobo/probo/pkg/coredata"
	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/page"
	"go.gearno.de/kit/pg"
)

type (
	TaskService struct {
		svc *TenantService
	}

	CreateTaskRequest struct {
		MitigationID gid.GID
		Name         string
		Description  string
		TimeEstimate *time.Duration
		AssignedToID *gid.GID
	}

	UpdateTaskRequest struct {
		TaskID          gid.GID
		ExpectedVersion int
		Name            *string
		Description     *string
		State           *coredata.TaskState
		TimeEstimate    *time.Duration
	}
)

func (s TaskService) Create(
	ctx context.Context,
	req CreateTaskRequest,
) (*coredata.Task, error) {
	mitigation := &coredata.Mitigation{}

	err := s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := mitigation.LoadByID(ctx, conn, s.svc.scope, req.MitigationID); err != nil {
				return fmt.Errorf("cannot load mitigation %q: %w", req.MitigationID, err)
			}

			now := time.Now()
			taskID, err := gid.NewGID(s.svc.scope.GetTenantID(), coredata.TaskEntityType)
			if err != nil {
				return fmt.Errorf("cannot generate id: %w", err)
			}

			task := &coredata.Task{
				ID:           taskID,
				MitigationID: req.MitigationID,
				Name:         req.Name,
				Description:  req.Description,
				TimeEstimate: req.TimeEstimate,
				AssignedToID: req.AssignedToID,
				State:        coredata.TaskStateTodo,
				CreatedAt:    now,
				UpdatedAt:    now,
			}

			return task.Insert(ctx, conn, s.svc.scope)
		},
	)
	if err != nil {
		return nil, fmt.Errorf("cannot create task: %w", err)
	}

	return s.Get(ctx, req.MitigationID)
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
	task := &coredata.Task{}

	err := s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			var assignErr error
			task, assignErr = coredata.AssignTask(ctx, conn, s.svc.scope, taskID, assignedToID)
			return assignErr
		},
	)
	if err != nil {
		if errors.Is(err, coredata.ErrAssignTaskFailed) {
			return nil, errors.New("failed to assign task, please try again")
		}
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
			var unassignErr error
			task, unassignErr = coredata.UnassignTask(ctx, conn, s.svc.scope, taskID)
			return unassignErr
		},
	)
	if err != nil {
		if errors.Is(err, coredata.ErrUnassignTaskFailed) {
			return nil, errors.New("failed to unassign task, please try again")
		}
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
			var updateErr error
			task, updateErr = coredata.UpdateTask(
				ctx,
				conn,
				s.svc.scope,
				req.TaskID,
				req.ExpectedVersion,
				&coredata.TaskUpdate{
					Name:         req.Name,
					Description:  req.Description,
					State:        req.State,
					TimeEstimate: req.TimeEstimate,
				},
			)
			return updateErr
		},
	)
	if err != nil {
		if errors.Is(err, coredata.ErrUpdateTaskFailed) {
			return nil, errors.New("failed to update task, please try again")
		}
		return nil, err
	}

	return task, nil
}

func (s TaskService) Delete(
	ctx context.Context,
	taskID gid.GID,
) error {
	err := s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			return coredata.DeleteTask(ctx, conn, s.svc.scope, taskID)
		},
	)
	if err != nil {
		if errors.Is(err, coredata.ErrDeleteTaskFailed) {
			return errors.New("failed to delete task, please try again")
		}
		return err
	}

	return nil
}

func (s TaskService) ListForMitigationID(
	ctx context.Context,
	mitigationID gid.GID,
	cursor *page.Cursor[coredata.TaskOrderField],
) (*page.Page[*coredata.Task, coredata.TaskOrderField], error) {
	var tasks coredata.Tasks

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return tasks.LoadByMitigationID(
				ctx,
				conn,
				s.svc.scope,
				mitigationID,
				cursor,
			)
		},
	)
	if err != nil {
		return nil, err
	}

	return page.NewPage(tasks, cursor), nil
}
