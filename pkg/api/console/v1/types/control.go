package types

import (
	"github.com/getprobo/probo/pkg/probo/coredata"
	"github.com/getprobo/probo/pkg/probo/coredata/page"
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

func NewControlEdge(f *coredata.Control) *ControlEdge {
	return &ControlEdge{
		Cursor: f.CursorKey(),
		Node:   NewControl(f),
	}
}

func NewControl(e *coredata.Control) *Control {
	return &Control{}
}
