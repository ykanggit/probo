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
	"io"
	"time"

	"gearno.de/ref"
	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/probo/coredata"
	"go.gearno.de/kit/pg"
)

type (
	CreateEvidenceRequest struct {
		TaskID gid.GID
		Name   string
		File   io.Reader
	}
)

func (s Service) CreateEvidence(
	ctx context.Context,
	req CreateEvidenceRequest,
) (*coredata.Evidence, error) {
	now := time.Now()
	evidenceID, err := gid.NewGID(coredata.EvidenceEntityType)
	if err != nil {
		return nil, fmt.Errorf("cannot create vendor global id: %w", err)
	}
	evidenceStateTransitionID, err := gid.NewGID(coredata.EvidenceStateTransitionEntityType)
	if err != nil {
		return nil, fmt.Errorf("cannot create evidence state transition: %w", err)
	}

	task := &coredata.Organization{}
	evidence := &coredata.Evidence{
		ID:        evidenceID,
		TaskID:    req.TaskID,
		State:     coredata.EvidenceStateValid,
		ObjectKey: "", // TODO upload file
		MimeType:  "",
		Size:      0,
		CreatedAt: now,
		UpdatedAt: now,
	}

	evidenceStateTransition := coredata.EvidenceStateTransition{
		StateTransition: coredata.StateTransition[coredata.EvidenceState]{
			ID:        evidenceStateTransitionID,
			FromState: nil,
			ToState:   evidence.State,
			Reason:    ref.Ref("Initial state"),
			CreatedAt: now,
			UpdatedAt: now,
		},
		EvidenceID: evidence.ID,
	}

	err = s.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := task.LoadByID(ctx, conn, s.scope, req.TaskID); err != nil {
				return fmt.Errorf("cannot load task %q: %w", req.TaskID, err)
			}

			if err := evidence.Insert(ctx, conn); err != nil {
				return fmt.Errorf("cannot insert vendor: %w", err)
			}

			if err := evidenceStateTransition.Insert(ctx, conn); err != nil {
				return fmt.Errorf("cannot insert evidence state transition: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return evidence, nil
}
