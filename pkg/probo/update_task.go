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

	"github.com/getprobo/probo/pkg/coredata"
	"github.com/getprobo/probo/pkg/gid"
	"go.gearno.de/kit/pg"
)

type UpdateTaskRequest struct {
	ID              gid.GID
	ExpectedVersion int
	Name            *string
	Description     *string
	State           *coredata.TaskState
}

func (s Service) UpdateTask(
	ctx context.Context,
	req UpdateTaskRequest,
) (*coredata.Task, error) {
	params := coredata.UpdateTaskParams{
		ExpectedVersion: req.ExpectedVersion,
		Name:            req.Name,
		Description:     req.Description,
		State:           req.State,
	}

	task := &coredata.Task{ID: req.ID}

	err := s.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			return task.Update(ctx, conn, s.scope, params)
		})
	if err != nil {
		return nil, err
	}

	return task, nil
}
