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
	VendorContactOrderBy OrderBy[coredata.VendorContactOrderField]
)

func NewVendorContactConnection(p *page.Page[*coredata.VendorContact, coredata.VendorContactOrderField]) *VendorContactConnection {
	var edges = make([]*VendorContactEdge, len(p.Data))

	for i := range edges {
		edges[i] = NewVendorContactEdge(p.Data[i], p.Cursor.OrderBy.Field)
	}

	return &VendorContactConnection{
		Edges:    edges,
		PageInfo: NewPageInfo(p),
	}
}

func NewVendorContactEdge(c *coredata.VendorContact, orderBy coredata.VendorContactOrderField) *VendorContactEdge {
	return &VendorContactEdge{
		Cursor: c.CursorKey(orderBy),
		Node:   NewVendorContact(c),
	}
}

func NewVendorContact(c *coredata.VendorContact) *VendorContact {
	return &VendorContact{
		ID:        c.ID,
		FullName:  c.FullName,
		Email:     c.Email,
		Phone:     c.Phone,
		Role:      c.Role,
		CreatedAt: c.CreatedAt,
		UpdatedAt: c.UpdatedAt,
	}
}
