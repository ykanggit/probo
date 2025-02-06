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

type (
	CreatePeopleRequest struct {
		OrganizationID           gid.GID
		FullName                 string
		PrimaryEmailAddress      string
		AdditionalEmailAddresses []string
	}
)

func (s Service) CreatePeople(
	ctx context.Context,
	req CreatePeopleRequest,
) (*coredata.People, error) {
	now := time.Now()
	peopleID, err := gid.NewGID(coredata.PeopleEntityType)
	if err != nil {
		return nil, fmt.Errorf("cannot create people global id: %w", err)
	}

	organization := &coredata.Organization{}
	people := &coredata.People{
		ID:                       peopleID,
		OrganizationID:           req.OrganizationID,
		FullName:                 req.FullName,
		PrimaryEmailAddress:      req.PrimaryEmailAddress,
		AdditionalEmailAddresses: req.AdditionalEmailAddresses,
		CreatedAt:                now,
		UpdatedAt:                now,
	}

	err = s.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := organization.LoadByID(ctx, conn, s.scope, req.OrganizationID); err != nil {
				return fmt.Errorf("cannot load organization %q: %w", req.OrganizationID, err)
			}

			if err := people.Insert(ctx, conn); err != nil {
				return fmt.Errorf("cannot insert people: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return people, nil
}
