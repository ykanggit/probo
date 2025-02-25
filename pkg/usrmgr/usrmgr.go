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
	"github.com/jackc/pgx/v5"
	"go.gearno.de/kit/migrator"
	"go.gearno.de/kit/pg"
)

type (
	Service struct {
		pg *pg.Client
		hp *HashingProfile
	}

	RegisterUserParams struct {
		Email    string
		Password string
	}

	ErrInvalidCredentials struct {
		message string
	}

	ErrUserAlreadyExists struct {
		message string
	}

	ErrSessionNotFound struct {
		message string
	}

	ErrSessionExpired struct {
		message string
	}
)

func (e ErrInvalidCredentials) Error() string {
	return e.message
}

func (e ErrUserAlreadyExists) Error() string {
	return e.message
}

func (e ErrSessionNotFound) Error() string {
	return e.message
}

func (e ErrSessionExpired) Error() string {
	return e.message
}

func NewService(
	ctx context.Context,
	pgClient *pg.Client,
	pepper []byte,
) (*Service, error) {
	err := migrator.NewMigrator(pgClient, coredata.Migrations).Run(ctx, "migrations")
	if err != nil {
		return nil, fmt.Errorf("cannot migrate database schema: %w", err)
	}

	hp, err := NewHashingProfile(pepper)
	if err != nil {
		return nil, fmt.Errorf("cannot create hashing profile: %w", err)
	}

	return &Service{
		pg: pgClient,
		hp: hp,
	}, nil
}

func (s Service) RegisterUser(
	ctx context.Context,
	params RegisterUserParams,
) (*coredata.User, error) {
	if params.Email == "" || params.Password == "" {
		return nil, fmt.Errorf("email and password are required")
	}

	// Use a high iteration count for password hashing
	const iterations = 600000
	hashedPassword, err := s.hp.HashPassword([]byte(params.Password), iterations)
	if err != nil {
		return nil, fmt.Errorf("cannot hash password: %w", err)
	}

	now := time.Now()
	user := &coredata.User{
		ID:             gid.New(),
		EmailAddress:   params.Email,
		HashedPassword: hashedPassword,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	err = s.pg.WithTx(
		ctx,
		func(tx pg.Conn) error {
			// Check if user already exists
			existingUser := &coredata.User{}
			err := existingUser.LoadByEmail(ctx, tx, params.Email)
			if err == nil {
				return &ErrUserAlreadyExists{message: "user with this email already exists"}
			}

			// Insert the new user
			if err := user.Insert(ctx, tx); err != nil {
				return fmt.Errorf("cannot insert user: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s Service) Login(
	ctx context.Context,
	email string,
	password string,
) (*coredata.Session, error) {
	now := time.Now()
	user := &coredata.User{}
	session := &coredata.Session{
		ID:        gid.New(),
		UserID:    gid.GID{}, // Will be set after user is loaded
		ExpiredAt: now.Add(24 * time.Hour),
		CreatedAt: now,
		UpdatedAt: now,
	}

	err := s.pg.WithTx(
		ctx,
		func(tx pg.Conn) error {
			if err := user.LoadByEmail(ctx, tx, email); err != nil {
				return &ErrInvalidCredentials{message: "invalid email or password"}
			}

			ok, err := s.hp.ComparePasswordAndHash([]byte(password), user.HashedPassword)
			if err != nil {
				return fmt.Errorf("cannot compare password: %w", err)
			}

			if !ok {
				return &ErrInvalidCredentials{message: "invalid email or password"}
			}

			// Set the user ID in the session
			session.UserID = user.ID

			if err := session.Insert(ctx, tx); err != nil {
				return fmt.Errorf("cannot insert session: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return session, nil
}

func (s Service) Logout(
	ctx context.Context,
	sessionID gid.GID,
) error {
	return s.pg.WithTx(
		ctx,
		func(tx pg.Conn) error {
			return coredata.DeleteSession(ctx, tx, sessionID)
		},
	)
}

func (s Service) GetSession(
	ctx context.Context,
	sessionID gid.GID,
) (*coredata.Session, error) {
	session := &coredata.Session{}

	err := s.pg.WithTx(
		ctx,
		func(tx pg.Conn) error {
			if err := session.LoadByID(ctx, tx, sessionID); err != nil {
				return &ErrSessionNotFound{message: "session not found"}
			}

			// Check if session is expired
			if time.Now().After(session.ExpiredAt) {
				// Delete expired session
				if err := coredata.DeleteSession(ctx, tx, sessionID); err != nil {
					return fmt.Errorf("cannot delete expired session: %w", err)
				}
				return &ErrSessionExpired{message: "session expired"}
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return session, nil
}

func (s Service) RefreshSession(
	ctx context.Context,
	sessionID gid.GID,
) (*coredata.Session, error) {
	session := &coredata.Session{}

	err := s.pg.WithTx(
		ctx,
		func(tx pg.Conn) error {
			if err := session.LoadByID(ctx, tx, sessionID); err != nil {
				return &ErrSessionNotFound{message: "session not found"}
			}

			// Check if session is expired
			if time.Now().After(session.ExpiredAt) {
				return &ErrSessionExpired{message: "session expired"}
			}

			// Update session expiration
			now := time.Now()
			session.ExpiredAt = now.Add(24 * time.Hour)
			session.UpdatedAt = now

			if err := session.Update(ctx, tx); err != nil {
				return fmt.Errorf("cannot update session: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return session, nil
}

func (s Service) GetUserByID(
	ctx context.Context,
	userID gid.GID,
) (*coredata.User, error) {
	user := &coredata.User{}

	err := s.pg.WithTx(
		ctx,
		func(tx pg.Conn) error {
			if err := user.LoadByID(ctx, tx, userID); err != nil {
				return fmt.Errorf("user not found: %w", err)
			}
			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s Service) GetUserBySession(
	ctx context.Context,
	sessionID gid.GID,
) (*coredata.User, error) {
	session, err := s.GetSession(ctx, sessionID)
	if err != nil {
		return nil, err
	}

	return s.GetUserByID(ctx, session.UserID)
}

// GetUserOrganization gets the organization ID for a user
func (s Service) GetUserOrganization(
	ctx context.Context,
	userID gid.GID,
) (gid.GID, error) {
	user, err := s.GetUserByID(ctx, userID)
	if err != nil {
		return gid.GID{}, err
	}

	return user.OrganizationID, nil
}

// GetUserOrganizations gets all organizations for a user
func (s Service) GetUserOrganizations(
	ctx context.Context,
	userID gid.GID,
) ([]gid.GID, error) {
	q := `
SELECT
    organization_id
FROM
    usrmgr_user_organizations
WHERE
    user_id = @user_id;
`

	args := pgx.NamedArgs{"user_id": userID}

	var organizationIDs []gid.GID

	err := s.pg.WithTx(
		ctx,
		func(tx pg.Conn) error {
			rows, err := tx.Query(ctx, q, args)
			if err != nil {
				return fmt.Errorf("failed to query user organizations: %w", err)
			}
			defer rows.Close()

			for rows.Next() {
				var organizationID gid.GID
				if err := rows.Scan(&organizationID); err != nil {
					return fmt.Errorf("failed to scan organization ID: %w", err)
				}
				organizationIDs = append(organizationIDs, organizationID)
			}

			if err := rows.Err(); err != nil {
				return fmt.Errorf("error iterating over rows: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return organizationIDs, nil
}

// AddUserToOrganization adds a user to an organization
func (s Service) AddUserToOrganization(
	ctx context.Context,
	userID gid.GID,
	organizationID gid.GID,
) error {
	q := `
INSERT INTO
    usrmgr_user_organizations (user_id, organization_id, created_at)
VALUES
    (@user_id, @organization_id, NOW())
ON CONFLICT (user_id, organization_id) DO NOTHING;
`

	args := pgx.NamedArgs{
		"user_id":         userID,
		"organization_id": organizationID,
	}

	return s.pg.WithTx(
		ctx,
		func(tx pg.Conn) error {
			_, err := tx.Exec(ctx, q, args)
			if err != nil {
				return fmt.Errorf("failed to add user to organization: %w", err)
			}
			return nil
		},
	)
}

// GetUserIDFromContext gets the user ID from the context
func (s Service) GetUserIDFromContext(ctx context.Context) (gid.GID, error) {
	// Get the session ID from the context
	sessionID, ok := ctx.Value("session_id").(gid.GID)
	if !ok {
		return gid.GID{}, fmt.Errorf("no session ID in context")
	}

	// Get the session
	session, err := s.GetSession(ctx, sessionID)
	if err != nil {
		return gid.GID{}, fmt.Errorf("failed to get session: %w", err)
	}

	return session.UserID, nil
}
