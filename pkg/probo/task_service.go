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
	TaskService struct {
		svc *TenantService
	}

	CreateTaskRequest struct {
		ControlID    gid.GID
		Name         string
		ContentRef   string
		Description  string
		TimeEstimate time.Duration
	}

	UpdateTaskRequest struct {
		ID              gid.GID
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
	now := time.Now()
	taskID, err := gid.NewGID(s.svc.scope.GetTenantID(), coredata.TaskEntityType)
	if err != nil {
		return nil, fmt.Errorf("cannot create task global id: %w", err)
	}

	control := &coredata.Control{}
	task := &coredata.Task{
		ID:           taskID,
		ControlID:    req.ControlID,
		Name:         req.Name,
		ContentRef:   req.ContentRef,
		State:        coredata.TaskStateTodo,
		Description:  req.Description,
		TimeEstimate: req.TimeEstimate,
		CreatedAt:    now,
		UpdatedAt:    now,
	}

	err = s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := control.LoadByID(ctx, conn, s.svc.scope, req.ControlID); err != nil {
				return fmt.Errorf("cannot laod control %q: %w", req.ControlID, err)
			}

			if err := task.Insert(ctx, conn, s.svc.scope); err != nil {
				return fmt.Errorf("cannot insert task: %w", err)
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
	params := coredata.UpdateTaskParams{
		ExpectedVersion: req.ExpectedVersion,
		Name:            req.Name,
		Description:     req.Description,
		State:           req.State,
		TimeEstimate:    req.TimeEstimate,
	}

	task := &coredata.Task{ID: req.ID}

	err := s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			return task.Update(ctx, conn, s.svc.scope, params)
		})
	if err != nil {
		return nil, err
	}

	return task, nil
}

func (s TaskService) ListForControlID(
	ctx context.Context,
	controlID gid.GID,
	cursor *page.Cursor,
) (*page.Page[*coredata.Task], error) {
	var tasks coredata.Tasks

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return tasks.LoadByControlID(
				ctx,
				conn,
				s.svc.scope,
				controlID,
				cursor,
			)
		},
	)

	if err != nil {
		return nil, err
	}

	return page.NewPage(tasks, cursor), nil
}

func (s TaskService) Delete(
	ctx context.Context,
	taskID gid.GID,
) error {
	task := coredata.Task{ID: taskID}
	return s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return task.Delete(ctx, conn, s.svc.scope)
		},
	)
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
