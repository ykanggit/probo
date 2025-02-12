package probo

import (
	"context"

	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/probo/coredata"
	"go.gearno.de/kit/pg"
)

func (s Service) DeleteVendor(
	ctx context.Context,
	vendorID gid.GID,
) error {
	vendor := coredata.Vendor{ID: vendorID}
	return s.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return vendor.Delete(ctx, conn, s.scope)
		},
	)
}
