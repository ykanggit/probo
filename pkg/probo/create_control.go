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

package probo

import (
	"context"
	"fmt"
	"time"

	"github.com/getprobo/probo/pkg/coredata"
	"github.com/getprobo/probo/pkg/gid"
	"go.gearno.de/kit/pg"
)

type (
	CreateControlRequest struct {
		FrameworkID gid.GID
		Name        string
		Description string
		ContentRef  string
		Category    string
	}
)

func (s Service) CreateControl(
	ctx context.Context,
	req CreateControlRequest,
) (*coredata.Control, error) {
	now := time.Now()
	controlID, err := gid.NewGID(s.scope.GetTenantID(), coredata.ControlEntityType)
	if err != nil {
		return nil, fmt.Errorf("cannot create control global id: %w", err)
	}

	framework := &coredata.Framework{}
	control := &coredata.Control{
		ID:          controlID,
		FrameworkID: req.FrameworkID,
		Name:        req.Name,
		Description: req.Description,
		Category:    req.Category,
		State:       coredata.ControlStateNotStarted,
		ContentRef:  req.ContentRef,
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	err = s.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := framework.LoadByID(ctx, conn, s.scope, req.FrameworkID); err != nil {
				return fmt.Errorf("cannot load framework %q: %w", req.FrameworkID, err)
			}

			if err := control.Insert(ctx, conn, s.scope); err != nil {
				return fmt.Errorf("cannot insert control: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return control, nil
}
