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
	AuditFilter struct {
		showOnTrustCenter *bool
	}
)

func NewAuditFilter() *AuditFilter {
	return &AuditFilter{}
}

func NewAuditTrustCenterFilter() *AuditFilter {
	showOnTrustCenter := true
	return &AuditFilter{
		showOnTrustCenter: &showOnTrustCenter,
	}
}

func (f *AuditFilter) SQLArguments() pgx.NamedArgs {
	args := pgx.NamedArgs{}

	if f.showOnTrustCenter != nil {
		args["show_on_trust_center"] = *f.showOnTrustCenter
	}

	return args
}

func (f *AuditFilter) SQLFragment() string {
	if f.showOnTrustCenter != nil {
		return "show_on_trust_center = @show_on_trust_center"
	}

	return "TRUE"
}
