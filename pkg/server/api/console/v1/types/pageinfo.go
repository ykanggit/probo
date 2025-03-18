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
	"gearno.de/ref"
	"github.com/getprobo/probo/pkg/page"
)

func NewPageInfo[T page.Paginable](p *page.Page[T]) *PageInfo {
	var (
		startCursor *page.CursorKey
		endCursor   *page.CursorKey
	)

	if len(p.Data) > 0 {
		startCursor = ref.Ref(p.First().CursorKey(p.Cursor.OrderBy.Field))
		endCursor = ref.Ref(p.Last().CursorKey(p.Cursor.OrderBy.Field))
	}

	return &PageInfo{
		HasNextPage:     p.Info.HasNext,
		HasPreviousPage: p.Info.HasPrev,
		StartCursor:     startCursor,
		EndCursor:       endCursor,
	}
}
