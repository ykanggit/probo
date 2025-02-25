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

package types

import (
	"time"

	"github.com/getprobo/probo/pkg/usrmgr/coredata"
)

type UserType struct {
	ID        string
	Email     string
	CreatedAt time.Time
	UpdatedAt time.Time
}

// NewUser creates a new UserType from a coredata.User
func NewUser(u *coredata.User) *UserType {
	return &UserType{
		ID:        u.ID.String(),
		Email:     u.EmailAddress,
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}
}

// AddUserToOrganizationInput is the input for adding a user to an organization
type AddUserToOrganizationInput struct {
	UserID         string
	OrganizationID string
}

// AddUserToOrganizationPayload is the payload for adding a user to an organization
type AddUserToOrganizationPayload struct {
	User *UserType
}
