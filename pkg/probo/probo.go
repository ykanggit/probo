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

	"github.com/getprobo/probo/pkg/probo/coredata"
	"github.com/getprobo/probo/pkg/probo/coredata/gid"
	"github.com/getprobo/probo/pkg/probo/coredata/page"
	"go.gearno.de/kit/migrator"
	"go.gearno.de/kit/pg"
)

type (
	Service struct {
		pg    *pg.Client
		scope *coredata.Scope
	}
)

func NewService(ctx context.Context, pgClient *pg.Client) (*Service, error) {
	err := migrator.NewMigrator(pgClient, coredata.Migrations).Run(ctx, "migrations")
	if err != nil {
		return nil, fmt.Errorf("cannot migrate database schema: %w", err)
	}

	return &Service{
		pg:    pgClient,
		scope: coredata.NewScope(), // must be created from auth
	}, nil
}

func (s *Service) GetOrganization(
	ctx context.Context,
	organizationID gid.GID,
) (*coredata.Organization, error) {
	organization := &coredata.Organization{}

	err := s.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return organization.LoadByID(
				ctx,
				conn,
				s.scope,
				organizationID,
			)
		},
	)

	if err != nil {
		return nil, err
	}

	return organization, nil
}

func (s *Service) ListOrganizationFrameworks(
	ctx context.Context,
	organizationID gid.GID,
	cursor *page.Cursor,
) (*page.Page[*coredata.Framework], error) {
	var frameworks coredata.Frameworks

	err := s.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return frameworks.LoadByOrganizationID(
				ctx,
				conn,
				s.scope,
				organizationID,
				cursor,
			)
		},
	)

	if err != nil {
		return nil, err
	}

	return page.NewPage(frameworks, cursor), nil
}

func (s *Service) ListFrameworkControls(
	ctx context.Context,
	frameworkID gid.GID,
	cursor *page.Cursor,
) (*page.Page[*coredata.Control], error) {
	var controls coredata.Controls

	err := s.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return controls.LoadByFrameworkID(
				ctx,
				conn,
				s.scope,
				frameworkID,
				cursor,
			)
		},
	)

	if err != nil {
		return nil, err
	}

	return page.NewPage(controls, cursor), nil
}

func (s *Service) ListControlTasks(
	ctx context.Context,
	controlID gid.GID,
	cursor *page.Cursor,
) (*page.Page[*coredata.Task], error) {
	var tasks coredata.Tasks

	err := s.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return tasks.LoadByControlID(
				ctx,
				conn,
				s.scope,
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
