package types

import (
	"github.com/getprobo/probo/pkg/probo/coredata"
	"github.com/getprobo/probo/pkg/probo/coredata/page"
)

func NewTaskConnection(p *page.Page[*coredata.Task]) *TaskConnection {
	var edges = make([]*TaskEdge, len(p.Data))

	for i := range edges {
		edges[i] = NewTaskEdge(p.Data[i])
	}

	return &TaskConnection{
		Edges:    edges,
		PageInfo: NewPageInfo(p),
	}
}

func NewTaskEdge(f *coredata.Task) *TaskEdge {
	return &TaskEdge{
		Cursor: f.CursorKey(),
		Node:   NewTask(f),
	}
}

func NewTask(e *coredata.Task) *Task {
	return &Task{}
}
