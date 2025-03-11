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
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/getprobo/probo/pkg/coredata"
	"github.com/getprobo/probo/pkg/crypto/passwdhash"
	"github.com/getprobo/probo/pkg/gid"
	"github.com/jackc/pgx/v5"
	"go.gearno.de/kit/pg"
)

type (
	Service struct {
		pg *pg.Client
		hp *passwdhash.Profile
	}

	ErrInvalidCredentials struct {
		message string
	}

	ErrInvalidEmail struct {
		email string
	}

	ErrInvalidPassword struct {
		length int
	}

	ErrInvalidFullName struct {
		fullName string
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

func (e ErrInvalidEmail) Error() string {
	return fmt.Sprintf("invalid email: %s", e.email)
}

func (e ErrInvalidPassword) Error() string {
	return fmt.Sprintf("invalid password: the length must be at least %d characters", e.length)
}

func (e ErrInvalidFullName) Error() string {
	return fmt.Sprintf("invalid full name: %s", e.fullName)
}

func NewService(
	ctx context.Context,
	pgClient *pg.Client,
	hp *passwdhash.Profile,
) (*Service, error) {
	return &Service{
		pg: pgClient,
		hp: hp,
	}, nil
}

func (s Service) SignUp(
	ctx context.Context,
	email, password, fullName string,
) (*coredata.User, *coredata.Session, error) {
	if !strings.Contains(email, "@") {
		return nil, nil, &ErrInvalidEmail{email}
	}

	if len(password) < 8 {
		return nil, nil, &ErrInvalidPassword{len(password)}
	}

	if fullName == "" {
		return nil, nil, &ErrInvalidFullName{fullName}
	}

	hashedPassword, err := s.hp.HashPassword([]byte(password))
	if err != nil {
		return nil, nil, fmt.Errorf("cannot hash password: %w", err)
	}

	now := time.Now()
	user := &coredata.User{
		ID:             gid.New(gid.NilTenant, coredata.UserEntityType),
		EmailAddress:   email,
		HashedPassword: hashedPassword,
		FullName:       fullName,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	session := &coredata.Session{
		ID:        gid.New(gid.NilTenant, coredata.SessionEntityType),
		UserID:    user.ID,
		ExpiredAt: now.Add(24 * time.Hour),
		CreatedAt: now,
		UpdatedAt: now,
	}

	err = s.pg.WithTx(
		ctx,
		func(tx pg.Conn) error {
			if err := user.Insert(ctx, tx); err != nil {
				return fmt.Errorf("cannot insert user: %w", err)
			}

			if err := session.Insert(ctx, tx); err != nil {
				return fmt.Errorf("cannot insert session: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, nil, err
	}

	return user, session, nil
}

func (s Service) SignIn(
	ctx context.Context,
	email, password string,
) (*coredata.User, *coredata.Session, error) {
	now := time.Now()
	user := &coredata.User{}
	session := &coredata.Session{
		ID:        gid.New(gid.NilTenant, coredata.SessionEntityType),
		UserID:    gid.Nil,
		ExpiredAt: now.Add(24 * time.Hour),
		CreatedAt: now,
		UpdatedAt: now,
	}

	err := s.pg.WithTx(
		ctx,
		func(tx pg.Conn) error {
			if err := user.LoadByEmail(ctx, tx, email); err != nil {
				var errUserNotFound *coredata.ErrUserNotFound

				if errors.As(err, &errUserNotFound) {
					return &ErrInvalidCredentials{message: "invalid email or password"}
				}

				return fmt.Errorf("cannot load user by email: %w", err)
			}

			ok, err := s.hp.ComparePasswordAndHash([]byte(password), user.HashedPassword)
			if err != nil {
				return fmt.Errorf("cannot compare password: %w", err)
			}

			if !ok {
				return &ErrInvalidCredentials{message: "invalid email or password"}
			}

			session.UserID = user.ID

			if err := session.Insert(ctx, tx); err != nil {
				return fmt.Errorf("cannot insert session: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, nil, err
	}

	return user, session, nil
}

func (s Service) SignOut(
	ctx context.Context,
	sessionID gid.GID,
) error {
	return s.pg.WithConn(
		ctx,
		func(tx pg.Conn) error {
			err := coredata.DeleteSession(ctx, tx, sessionID)
			if err != nil {
				return fmt.Errorf("cannot delete session: %w", err)
			}

			return nil
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

	args := pgx.StrictNamedArgs{"user_id": userID}

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

	args := pgx.StrictNamedArgs{
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

// UpdateSession updates a session in the database
func (s Service) UpdateSession(
	ctx context.Context,
	session *coredata.Session,
) error {
	session.UpdatedAt = time.Now()
	session.ExpiredAt = time.Now().Add(24 * time.Hour)

	return s.pg.WithTx(
		ctx,
		func(tx pg.Conn) error {
			return session.Update(ctx, tx)
		},
	)
}
