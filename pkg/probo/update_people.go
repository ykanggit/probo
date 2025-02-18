package probo

import (
	"context"

	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/probo/coredata"
	"go.gearno.de/kit/pg"
)

type UpdatePeopleRequest struct {
	ID                       gid.GID
	ExpectedVersion          int
	Kind                     *coredata.PeopleKind
	FullName                 *string
	PrimaryEmailAddress      *string
	AdditionalEmailAddresses *[]string
}

func (s Service) UpdatePeople(
	ctx context.Context,
	req UpdatePeopleRequest,
) (*coredata.People, error) {
	params := coredata.UpdatePeopleParams{
		ExpectedVersion:          req.ExpectedVersion,
		Kind:                     req.Kind,
		FullName:                 req.FullName,
		PrimaryEmailAddress:      req.PrimaryEmailAddress,
		AdditionalEmailAddresses: req.AdditionalEmailAddresses,
	}

	people := &coredata.People{ID: req.ID}

	err := s.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			return people.Update(ctx, conn, s.scope, params)
		})
	if err != nil {
		return nil, err
	}

	return people, nil
}
