package probo

import (
	"context"

	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/probo/coredata"
	"go.gearno.de/kit/pg"
)

func (s Service) DeletePeople(
	ctx context.Context,
	peopleID gid.GID,
) error {
	people := coredata.People{ID: peopleID}

	return s.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return people.Delete(ctx, conn, s.scope)
		},
	)
}
