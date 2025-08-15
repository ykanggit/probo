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
	"errors"
	"fmt"
	"maps"
	"time"

	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/page"
	"github.com/jackc/pgx/v5"
	"go.gearno.de/kit/pg"
)

type (
	VendorContact struct {
		ID        gid.GID   `db:"id"`
		VendorID  gid.GID   `db:"vendor_id"`
		FullName  *string   `db:"full_name"`
		Email     *string   `db:"email"`
		Phone     *string   `db:"phone"`
		Role      *string   `db:"role"`
		CreatedAt time.Time `db:"created_at"`
		UpdatedAt time.Time `db:"updated_at"`
	}

	VendorContacts []*VendorContact

	ErrVendorContactNotFound struct {
		Identifier string
	}
)

func (e ErrVendorContactNotFound) Error() string {
	return fmt.Sprintf("vendor contact not found: %s", e.Identifier)
}

func (vc VendorContact) CursorKey(orderBy VendorContactOrderField) page.CursorKey {
	switch orderBy {
	case VendorContactOrderFieldCreatedAt:
		return page.CursorKey{ID: vc.ID, Value: vc.CreatedAt}
	case VendorContactOrderFieldFullName:
		return page.CursorKey{ID: vc.ID, Value: vc.FullName}
	case VendorContactOrderFieldEmail:
		return page.CursorKey{ID: vc.ID, Value: vc.Email}
	}

	panic(fmt.Sprintf("unsupported order by: %s", orderBy))
}

func (vc *VendorContact) LoadByID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	vendorContactID gid.GID,
) error {
	q := `
SELECT
	id,
	vendor_id,
	full_name,
	email,
	phone,
	role,
	created_at,
	updated_at
FROM
	vendor_contacts
WHERE
	%s
	AND id = @vendor_contact_id
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"vendor_contact_id": vendorContactID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query vendor contact: %w", err)
	}
	defer rows.Close()

	vendorContact, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[VendorContact])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return &ErrVendorContactNotFound{Identifier: vendorContactID.String()}
		}

		return fmt.Errorf("cannot collect vendor contact: %w", err)
	}

	*vc = vendorContact

	return nil
}

func (vc *VendorContacts) LoadByVendorID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	vendorID gid.GID,
	cursor *page.Cursor[VendorContactOrderField],
) error {
	q := `
SELECT
	id,
	vendor_id,
	full_name,
	email,
	phone,
	role,
	created_at,
	updated_at
FROM
	vendor_contacts
WHERE
	%s
	AND vendor_id = @vendor_id
	AND %s
`
	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.StrictNamedArgs{
		"vendor_id": vendorID,
	}
	maps.Copy(args, scope.SQLArguments())
	maps.Copy(args, cursor.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query vendor contacts: %w", err)
	}
	defer rows.Close()

	vendorContacts, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[VendorContact])
	if err != nil {
		return fmt.Errorf("cannot collect vendor contacts: %w", err)
	}

	*vc = vendorContacts

	return nil
}

func (vc VendorContact) Insert(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
INSERT INTO
	vendor_contacts (
		tenant_id,
		id,
		vendor_id,
		full_name,
		email,
		phone,
		role,
		created_at,
		updated_at
	)
VALUES (
	@tenant_id,
	@vendor_contact_id,
	@vendor_id,
	@full_name,
	@email,
	@phone,
	@role,
	@created_at,
	@updated_at
)
`

	args := pgx.StrictNamedArgs{
		"tenant_id":         scope.GetTenantID(),
		"vendor_contact_id": vc.ID,
		"vendor_id":         vc.VendorID,
		"full_name":         vc.FullName,
		"email":             vc.Email,
		"phone":             vc.Phone,
		"role":              vc.Role,
		"created_at":        vc.CreatedAt,
		"updated_at":        vc.UpdatedAt,
	}

	_, err := conn.Exec(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot insert vendor contact: %w", err)
	}

	return nil
}

func (vc VendorContact) Update(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
UPDATE
	vendor_contacts
SET
	full_name = @full_name,
	email = @email,
	phone = @phone,
	role = @role,
	updated_at = @updated_at
WHERE
	%s
	AND id = @vendor_contact_id
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{
		"vendor_contact_id": vc.ID,
		"full_name":         vc.FullName,
		"email":             vc.Email,
		"phone":             vc.Phone,
		"role":              vc.Role,
		"updated_at":        vc.UpdatedAt,
	}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot update vendor contact: %w", err)
	}

	return nil
}

func (vc VendorContact) Delete(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
DELETE FROM
	vendor_contacts
WHERE
	%s
	AND id = @vendor_contact_id
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"vendor_contact_id": vc.ID}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot delete vendor contact: %w", err)
	}

	return nil
}
