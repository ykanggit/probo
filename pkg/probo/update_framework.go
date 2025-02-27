package probo

import (
	"context"

	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/probo/coredata"
	"go.gearno.de/kit/pg"
)

type UpdateFrameworkRequest struct {
	ID              gid.GID
	ExpectedVersion int
	Name            *string
	Description     *string
}

func (s Service) UpdateFramework(
	ctx context.Context,
	req UpdateFrameworkRequest,
) (*coredata.Framework, error) {
	params := coredata.UpdateFrameworkParams{
		ExpectedVersion: req.ExpectedVersion,
		Name:            req.Name,
		Description:     req.Description,
	}

	framework := &coredata.Framework{ID: req.ID}

	err := s.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			return framework.Update(ctx, conn, s.scope, params)
		})
	if err != nil {
		return nil, err
	}

	return framework, nil
}
