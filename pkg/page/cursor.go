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

package page

import (
	"fmt"

	"github.com/jackc/pgx/v5"
)

type (
	Cursor struct {
		Size     int
		Key      *CursorKey
		Position Position
	}

	Position int8
)

const (
	DefaultCursorSize = 25

	Tail Position = iota
	Head
)

func (p Position) ToDirection() string {
	switch p {
	case Tail:
		return "ASC"
	case Head:
		return "DESC"
	default:
		panic(fmt.Errorf("unknown direction: %d", p))
	}
}

func NewCursor(size int, from *CursorKey, pos Position) *Cursor {
	if size == 0 {
		size = DefaultCursorSize
	}

	return &Cursor{
		Size:     size,
		Key:      from,
		Position: pos,
	}
}

func (c *Cursor) SQLFragment() string {
	return `
  CASE
    WHEN @cursor_order = 'DESC' AND @cursor_from_id::TEXT IS NOT NULL THEN (
      (created_at <= @cursor_from_ts) AND NOT (created_at = @cursor_from_ts AND id > @cursor_from_id)
    )
    WHEN @cursor_order = 'ASC' AND @cursor_from_id::TEXT IS NOT NULL THEN (
      (created_at >= @cursor_from_ts) AND NOT (created_at = @cursor_from_ts AND id < @cursor_from_id)
    )
    ELSE TRUE
  END
ORDER BY
  CASE
    WHEN @cursor_order = 'ASC' THEN created_at
  END ASC,
  CASE
    WHEN @cursor_order = 'ASC' THEN id
  END ASC,
  CASE
    WHEN @cursor_order = 'DESC' THEN created_at
  END DESC,
  CASE
    WHEN @cursor_order = 'DESC' THEN id
  END DESC
LIMIT @cursor_limit
`
}

func (c *Cursor) SQLArguments() pgx.StrictNamedArgs {
	var size = c.Size
	if c.Key == nil {
		size += 1
	} else {
		size += 2
	}

	arguments := pgx.StrictNamedArgs{
		"cursor_order":   c.Position.ToDirection(),
		"cursor_limit":   size,
		"cursor_from_id": nil,
		"cursor_from_ts": nil,
	}

	if c.Key != nil {
		arguments["cursor_from_id"] = c.Key.ID()
		arguments["cursor_from_ts"] = c.Key.Timestamp()
	}

	return arguments
}
