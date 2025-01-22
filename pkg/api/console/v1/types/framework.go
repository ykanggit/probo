package types

import (
	"github.com/getprobo/probo/pkg/probo/coredata"
	"github.com/getprobo/probo/pkg/probo/coredata/page"
)

func NewFrameworkConnection(p *page.Page[*coredata.Framework]) *FrameworkConnection {
	var edges = make([]*FrameworkEdge, len(p.Data))

	for i := range edges {
		edges[i] = NewFrameworkEdge(p.Data[i])
	}

	return &FrameworkConnection{
		Edges:    edges,
		PageInfo: NewPageInfo(p),
	}
}

func NewFrameworkEdge(f *coredata.Framework) *FrameworkEdge {
	return &FrameworkEdge{
		Cursor: f.CursorKey(),
		Node:   NewFramework(f),
	}
}

func NewFramework(e *coredata.Framework) *Framework {
	return &Framework{}
}
