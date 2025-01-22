package types

import (
	"errors"
	"io"
	"strconv"

	"github.com/99designs/gqlgen/graphql"
	"github.com/getprobo/probo/pkg/probo/coredata/page"
)

func NewCursor(
	first *int,
	after *page.CursorKey,
	last *int,
	before *page.CursorKey,
) *page.Cursor {
	var (
		size      int
		from      *page.CursorKey
		direction = page.Head
	)

	if first != nil {
		size = *first
		direction = page.Head
		from = after
	} else if last != nil {
		size = *last
		direction = page.Tail
		from = before
	}

	return page.NewCursor(size, from, direction)
}

func MarshalCursorKeyScalar(ck page.CursorKey) graphql.Marshaler {
	return graphql.WriterFunc(func(w io.Writer) {
		w.Write([]byte(strconv.Quote(ck.String())))
	})
}

func UnmarshalCursorKeyScalar(v interface{}) (page.CursorKey, error) {
	s, ok := v.(string)
	if !ok {
		return page.CursorKeyNil, errors.New("must be a string")
	}

	ck, err := page.ParseCursorKey(s)
	if err != nil {
		return page.CursorKeyNil, err
	}

	return ck, nil
}
