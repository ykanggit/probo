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
	PolicyVersionOrderBy OrderBy[coredata.PolicyVersionOrderField]
)

func NewPolicyVersionConnection(page *page.Page[*coredata.PolicyVersion, coredata.PolicyVersionOrderField]) *PolicyVersionConnection {
	edges := make([]*PolicyVersionEdge, len(page.Data))
	for i, policyVersion := range page.Data {
		edges[i] = NewPolicyVersionEdge(policyVersion, page.Cursor.OrderBy.Field)
	}

	return &PolicyVersionConnection{
		Edges:    edges,
		PageInfo: NewPageInfo(page),
	}
}

func NewPolicyVersionEdge(policyVersion *coredata.PolicyVersion, orderBy coredata.PolicyVersionOrderField) *PolicyVersionEdge {
	return &PolicyVersionEdge{
		Cursor: policyVersion.CursorKey(orderBy),
		Node:   NewPolicyVersion(policyVersion),
	}
}

func NewPolicyVersion(policyVersion *coredata.PolicyVersion) *PolicyVersion {
	return &PolicyVersion{
		ID:          policyVersion.ID,
		Version:     policyVersion.VersionNumber,
		Content:     policyVersion.Content,
		Status:      policyVersion.Status,
		PublishedAt: policyVersion.PublishedAt,
		Changelog:   policyVersion.Changelog,
		CreatedAt:   policyVersion.CreatedAt,
		UpdatedAt:   policyVersion.UpdatedAt,
	}
}
