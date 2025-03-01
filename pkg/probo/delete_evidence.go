package probo

import (
	"context"
	"fmt"

	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/probo/coredata"
	"go.gearno.de/kit/pg"
)

func (s *Service) DeleteEvidence(
	ctx context.Context,
	evidenceID gid.GID,
) error {
	evidenceStateTransitions := &coredata.EvidenceStateTransitions{}
	evidence := &coredata.Evidence{ID: evidenceID}

	return s.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := evidenceStateTransitions.DeleteForEvidenceID(ctx, conn, s.scope, evidenceID); err != nil {
				return fmt.Errorf("cannot delete evidence state transitions: %w", err)
			}

			if err := evidence.Delete(ctx, conn, s.scope); err != nil {
				return fmt.Errorf("cannot delete evidence: %w", err)
			}

			return nil
		},
	)
}
