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
	"github.com/getprobo/probo/pkg/page"
	"github.com/getprobo/probo/pkg/probo/coredata"
)

func NewVendorConnection(p *page.Page[*coredata.Vendor]) *VendorConnection {
	var edges = make([]*VendorEdge, len(p.Data))

	for i := range edges {
		edges[i] = NewVendorEdge(p.Data[i])
	}

	return &VendorConnection{
		Edges:    edges,
		PageInfo: NewPageInfo(p),
	}
}

func NewVendorEdge(v *coredata.Vendor) *VendorEdge {
	return &VendorEdge{
		Cursor: v.CursorKey(),
		Node:   NewVendor(v),
	}
}

func NewVendor(v *coredata.Vendor) *Vendor {
	return &Vendor{
		ID:                     v.ID,
		Name:                   v.Name,
		Description:            v.Description,
		CreatedAt:              v.CreatedAt,
		UpdatedAt:              v.UpdatedAt,
		ServiceStartDate:       v.ServiceStartDate,
		ServiceTerminationDate: v.ServiceTerminationDate,
		ServiceCriticality:     v.ServiceCriticality,
		RiskTier:               v.RiskTier,
		StatusPageURL:          v.StatusPageURL,
		TermsOfServiceURL:      v.TermsOfServiceURL,
		PrivacyPolicyURL:       v.PrivacyPolicyURL,
	}
}
