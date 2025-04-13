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

type (
	MesureOrderBy OrderBy[coredata.MesureOrderField]
)

func NewMesureConnection(p *page.Page[*coredata.Mesure, coredata.MesureOrderField]) *MesureConnection {
	var edges = make([]*MesureEdge, len(p.Data))

	for i := range edges {
		edges[i] = NewMesureEdge(p.Data[i], p.Cursor.OrderBy.Field)
	}

	return &MesureConnection{
		Edges:    edges,
		PageInfo: NewPageInfo(p),
	}
}

func NewMesureEdge(c *coredata.Mesure, orderBy coredata.MesureOrderField) *MesureEdge {
	return &MesureEdge{
		Cursor: c.CursorKey(orderBy),
		Node:   NewMesure(c),
	}
}

func NewMesure(c *coredata.Mesure) *Mesure {
	return &Mesure{
		ID:          c.ID,
		Category:    c.Category,
		Name:        c.Name,
		Description: c.Description,
		State:       c.State,
		Importance:  c.Importance,
		CreatedAt:   c.CreatedAt,
		UpdatedAt:   c.UpdatedAt,
	}
}
