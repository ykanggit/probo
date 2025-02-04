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

package coredata

import (
	"context"
	"time"

	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/page"
	"github.com/jackc/pgx/v5"
	"go.gearno.de/crypto/uuid"
	"go.gearno.de/kit/pg"
)

type (
	User struct {
		ID             gid.GID
		EmailAddress   string
		HashedPassword []byte
		CreatedAt      time.Time
		UpdatedAt      time.Time
	}
)

func (u User) CursorKey() page.CursorKey {
	return page.NewCursorKey(uuid.UUID(u.ID), u.CreatedAt)
}

func (u *User) scan(r pgx.Row) error {
	return r.Scan(
		&u.ID,
		&u.EmailAddress,
		&u.HashedPassword,
		&u.CreatedAt,
		&u.UpdatedAt,
	)
}

func (u *User) LoadByEmail(
	ctx context.Context,
	conn pg.Conn,
	email string,
) error {
	q := `
SELECT
    id,
    email_address,
    hashed_password,
    created_at,
    updated_at
FROM
    users
WHERE
    email = @user_email
LIMIT 1;
`

	args := pgx.NamedArgs{"user_email": email}

	r := conn.QueryRow(ctx, q, args)

	u2 := User{}
	if err := u2.scan(r); err != nil {
		return err
	}

	*u = u2

	return nil
}
