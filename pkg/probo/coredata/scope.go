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
	"github.com/jackc/pgx/v5"
)

type (
	Scoper interface {
		SQLArguments() pgx.StrictNamedArgs
		SQLFragment() string
		GetTenantID() *string
	}

	NoScope struct{}

	Scope struct {
		TenantID string
	}
)

var (
	_ Scoper = (*NoScope)(nil)
	_ Scoper = (*Scope)(nil)
)

func NewNoScope() *NoScope {
	return &NoScope{}
}

func (*NoScope) SQLArguments() pgx.StrictNamedArgs {
	return pgx.StrictNamedArgs{}
}

func (*NoScope) SQLFragment() string {
	return "TRUE"
}

func (*NoScope) GetTenantID() *string {
	return nil
}

func NewScope(tenantID string) *Scope {
	return &Scope{
		TenantID: tenantID,
	}
}

func (s *Scope) SQLArguments() pgx.StrictNamedArgs {
	return pgx.StrictNamedArgs{
		"tenant_id": s.TenantID,
	}
}

func (*Scope) SQLFragment() string {
	return "tenant_id = @tenant_id"
}

func (s *Scope) GetTenantID() *string {
	return &s.TenantID
}
