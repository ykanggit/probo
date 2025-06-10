package types

import (
	"github.com/getprobo/probo/pkg/coredata"
	"github.com/getprobo/probo/pkg/gid"
)

type (
	ControlConnection struct {
		TotalCount int
		Edges      []*ControlEdge
		PageInfo   PageInfo

		Resolver any
		ParentID gid.GID
		Filters  *coredata.ControlFilter
	}
)
