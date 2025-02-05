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

package usrmgr

import (
	"context"
	"fmt"
	"time"

	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/usrmgr/coredata"
	"go.gearno.de/kit/migrator"
	"go.gearno.de/kit/pg"
)

type (
	Service struct {
		pg *pg.Client
		hp *HashingProfile
	}
)

func NewService(
	ctx context.Context,
	pgClient *pg.Client,
) (*Service, error) {
	err := migrator.NewMigrator(pgClient, coredata.Migrations).Run(ctx, "migrations")
	if err != nil {
		return nil, fmt.Errorf("cannot migrate database schema: %w", err)
	}

	return &Service{
		pg: pgClient,
	}, nil
}

func (s Service) Login(
	ctx context.Context,
	email string,
	password string,
) (*coredata.Session, error) {
	now := time.Now()
	user := &coredata.User{}
	session := &coredata.Session{
		ID:        gid.GID{},
		UserID:    user.ID,
		ExpiredAt: now.Add(24 * time.Hour),
		CreatedAt: now,
		UpdatedAt: now,
	}

	err := s.pg.WithTx(
		ctx,
		func(tx pg.Conn) error {
			if err := user.LoadByEmail(ctx, tx, email); err != nil {
				return fmt.Errorf("cannot load user by email: %w", err)
			}

			ok, err := s.hp.ComparePasswordAndHash([]byte(password), user.HashedPassword)
			if err != nil {
				return fmt.Errorf("cannot constant compare byte: %w", err)
			}

			if !ok {
				return fmt.Errorf("invalid password")
			}

			if err := session.Insert(ctx, tx); err != nil {
				return fmt.Errorf("cannot insert session: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return nil, nil
}

func (s Service) Logout(sessionID string) error {
	return nil
}

func (s Service) GetSession(sessionID string) (*coredata.Session, error) {
	return nil, nil
}
