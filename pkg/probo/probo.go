package probo

import (
	"context"

	"github.com/getprobo/probo/pkg/probo/coredata"
	"github.com/getprobo/probo/pkg/probo/coredata/page"
	"go.gearno.de/kit/pg"
)

type (
	Service struct {
		pg *pg.Client
	}
)

func NewService(ctx context.Context, pgClient *pg.Client) *Service {
	return &Service{
		pg: pgClient,
	}
}

func (s *Service) GetOrganization(
	ctx context.Context,
	organizationID string,
) (*coredata.Organization, error) {
	organization := &coredata.Organization{}

	err := s.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return organization.LoadByID(ctx, conn, organizationID)
		},
	)

	if err != nil {
		return nil, err
	}

	return organization, nil
}

func (s *Service) ListOrganizationFramework(
	ctx context.Context,
	organizationID string,
	cursor *page.Cursor,
) (*page.Page[*coredata.Framework], error) {
	var frameworks coredata.Frameworks

	err := s.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return frameworks.LoadByOrganizationID(ctx, conn, organizationID, cursor)
		},
	)

	if err != nil {
		return nil, err
	}

	return page.NewPage(frameworks, cursor), nil
}
