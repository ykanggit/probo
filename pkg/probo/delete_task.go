package probo

import (
	"context"

	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/probo/coredata"
	"go.gearno.de/kit/pg"
)

func (s Service) DeleteTask(
	ctx context.Context,
	taskID gid.GID,
) error {
	task := coredata.Task{ID: taskID}
	return s.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return task.Delete(ctx, conn, s.scope)
		},
	)
}
