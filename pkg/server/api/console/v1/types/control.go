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
	"github.com/getprobo/probo/pkg/coredata"
	"github.com/getprobo/probo/pkg/page"
)

func NewControlConnection(p *page.Page[*coredata.Control]) *ControlConnection {
	var edges = make([]*ControlEdge, len(p.Data))

	for i := range edges {
		edges[i] = NewControlEdge(p.Data[i])
	}

	return &ControlConnection{
		Edges:    edges,
		PageInfo: NewPageInfo(p),
	}
}

func NewControlEdge(c *coredata.Control) *ControlEdge {
	return &ControlEdge{
		Cursor: c.CursorKey(),
		Node:   NewControl(c),
	}
}

func NewControl(c *coredata.Control) *Control {
	return &Control{
		ID:          c.ID,
		Version:     c.Version,
		Category:    c.Category,
		Name:        c.Name,
		Description: c.Description,
		State:       c.State,
		Importance:  c.Importance,
		CreatedAt:   c.CreatedAt,
		UpdatedAt:   c.UpdatedAt,
	}
}
