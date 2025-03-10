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
	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/probo/coredata"
	"go.gearno.de/kit/pg"
)

type (
	CreateTaskRequest struct {
		ControlID   gid.GID
		Name        string
		ContentRef  string
		Description string
	}
)

func (s Service) CreateTask(
	ctx context.Context,
	req CreateTaskRequest,
) (*coredata.Task, error) {
	now := time.Now()
	taskID, err := gid.NewGID(s.scope.GetTenantID(), coredata.TaskEntityType)
	if err != nil {
		return nil, fmt.Errorf("cannot create task global id: %w", err)
	}
	taskStateTransitionID, err := gid.NewGID(s.scope.GetTenantID(), coredata.TaskStateTransitionEntityType)
	if err != nil {
		return nil, fmt.Errorf("cannot create task state transition global id: %w", err)
	}

	control := &coredata.Control{}
	task := &coredata.Task{
		ID:          taskID,
		ControlID:   req.ControlID,
		Name:        req.Name,
		ContentRef:  req.ContentRef,
		Description: req.Description,
		State:       coredata.TaskStateTodo,
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	taskStateTransition := coredata.TaskStateTransition{
		StateTransition: coredata.StateTransition[coredata.TaskState]{
			ID:        taskStateTransitionID,
			FromState: nil,
			ToState:   task.State,
			Reason:    ref.Ref("Initial state"),
			CreatedAt: now,
			UpdatedAt: now,
		},
		TaskID: task.ID,
	}

	err = s.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := control.LoadByID(ctx, conn, s.scope, req.ControlID); err != nil {
				return fmt.Errorf("cannot laod control %q: %w", req.ControlID, err)
			}

			if err := task.Insert(ctx, conn, s.scope); err != nil {
				return fmt.Errorf("cannot insert task: %w", err)
			}

			if err := taskStateTransition.Insert(ctx, conn, s.scope); err != nil {
				return fmt.Errorf("cannot insert task state transition: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return task, nil
}
