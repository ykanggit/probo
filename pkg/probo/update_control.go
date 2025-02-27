package probo

import (
	"context"

	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/probo/coredata"
	"go.gearno.de/kit/pg"
)

type UpdateControlRequest struct {
	ID              gid.GID
	ExpectedVersion int
	Name            *string
	Description     *string
	Category        *string
	State           *coredata.ControlState
}

func (s Service) UpdateControl(
	ctx context.Context,
	req UpdateControlRequest,
) (*coredata.Control, error) {
	params := coredata.UpdateControlParams{
		ExpectedVersion: req.ExpectedVersion,
		Name:            req.Name,
		Description:     req.Description,
		Category:        req.Category,
		State:           req.State,
	}

	control := &coredata.Control{ID: req.ID}

	err := s.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			return control.Update(ctx, conn, s.scope, params)
		})
	if err != nil {
		return nil, err
	}

	return control, nil
}
