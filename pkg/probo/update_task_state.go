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

	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/probo/coredata"
	"go.gearno.de/kit/pg"
)

type UpdateTaskStateRequest struct {
	TaskID gid.GID
	State  coredata.TaskState
	Reason *string
}

func (s Service) UpdateTaskState(
	ctx context.Context,
	req UpdateTaskStateRequest,
) (*coredata.Task, error) {

	// TODO: lock the task for update to ensure that only one update can happen at a time

	task, err := s.GetTask(ctx, req.TaskID)
	if err != nil {
		return nil, fmt.Errorf("cannot get task: %w", err)
	}

	if task.State == req.State {
		return task, nil
	}

	taskStateTransitionID, err := gid.NewGID(s.scope.GetTenantID(), coredata.TaskStateTransitionEntityType)
	if err != nil {
		return nil, fmt.Errorf("cannot create task state transition global id: %w", err)
	}

	now := time.Now()
	currentState := task.State

	taskStateTransition := coredata.TaskStateTransition{
		StateTransition: coredata.StateTransition[coredata.TaskState]{
			ID:        taskStateTransitionID,
			FromState: &currentState,
			ToState:   req.State,
			Reason:    req.Reason,
			CreatedAt: now,
			UpdatedAt: now,
		},
		TaskID: task.ID,
	}

	task.State = req.State
	task.UpdatedAt = now

	err = s.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
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
