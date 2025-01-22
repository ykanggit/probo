package types

import (
	"gearno.de/ref"
	"github.com/getprobo/probo/pkg/probo/coredata/page"
)

func NewPageInfo[T page.Paginable](p *page.Page[T]) *PageInfo {
	var (
		startCursor *page.CursorKey
		endCursor   *page.CursorKey
	)

	if len(p.Data) > 0 {
		startCursor = ref.Ref(p.First().CursorKey())
		endCursor = ref.Ref(p.Last().CursorKey())
	}

	return &PageInfo{
		HasNextPage:     p.Info.HasNext,
		HasPreviousPage: p.Info.HasPrev,
		StartCursor:     startCursor,
		EndCursor:       endCursor,
	}
}
