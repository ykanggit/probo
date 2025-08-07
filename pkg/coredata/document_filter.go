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
	DocumentFilter struct {
		query             *string
		showOnTrustCenter *bool
	}
)

func NewDocumentFilter(query *string) *DocumentFilter {
	return &DocumentFilter{
		query: query,
	}
}

func NewDocumentTrustCenterFilter() *DocumentFilter {
	showOnTrustCenter := true
	return &DocumentFilter{
		showOnTrustCenter: &showOnTrustCenter,
	}
}

func (f *DocumentFilter) SQLArguments() pgx.StrictNamedArgs {
	return pgx.StrictNamedArgs{
		"query":                f.query,
		"show_on_trust_center": f.showOnTrustCenter,
	}
}

func (f *DocumentFilter) SQLFragment() string {
	return `
(
	CASE
		WHEN @query::text IS NOT NULL AND @query::text != '' THEN
			search_vector @@ (
				SELECT to_tsquery('simple', string_agg(lexeme || ':*', ' & '))
				FROM unnest(regexp_split_to_array(trim(@query::text), '\s+')) AS lexeme
			)
		ELSE TRUE
	END
	AND
	CASE
		WHEN @show_on_trust_center::boolean IS NOT NULL THEN
			show_on_trust_center = @show_on_trust_center::boolean
		ELSE TRUE
	END
)`
}
