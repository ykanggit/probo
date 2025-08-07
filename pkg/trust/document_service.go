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

package trust

import (
	"context"
	"fmt"
	"io"

	"github.com/getprobo/probo/pkg/coredata"
	"github.com/getprobo/probo/pkg/docgen"
	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/html2pdf"
	"github.com/getprobo/probo/pkg/page"
	"go.gearno.de/kit/pg"
)

type (
	DocumentService struct {
		svc               *TenantService
		html2pdfConverter *html2pdf.Converter
	}
)

// ListVersions lists all versions of a document
func (s *DocumentService) ListVersions(
	ctx context.Context,
	documentID gid.GID,
	cursor *page.Cursor[coredata.DocumentVersionOrderField],
) (*page.Page[*coredata.DocumentVersion, coredata.DocumentVersionOrderField], error) {
	var documentVersions coredata.DocumentVersions

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return documentVersions.LoadByDocumentID(ctx, conn, s.svc.scope, documentID, cursor)
		},
	)

	if err != nil {
		return nil, err
	}

	return page.NewPage(documentVersions, cursor), nil
}

func (s *DocumentService) ListForOrganizationId(
	ctx context.Context,
	organizationID gid.GID,
	cursor *page.Cursor[coredata.DocumentOrderField],
) (*page.Page[*coredata.Document, coredata.DocumentOrderField], error) {
	var documents coredata.Documents

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			filter := coredata.NewDocumentTrustCenterFilter()
			err := documents.LoadByOrganizationID(ctx, conn, s.svc.scope, organizationID, cursor, filter)
			if err != nil {
				return fmt.Errorf("cannot load documents: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return page.NewPage(documents, cursor), nil
}

func (s *DocumentService) ExportPDF(
	ctx context.Context,
	documentID gid.GID,
) ([]byte, error) {
	document := &coredata.Document{}
	version := &coredata.DocumentVersion{}
	owner := &coredata.People{}
	publishedBy := &coredata.People{}
	signatures := coredata.DocumentVersionSignatures{}
	peopleMap := make(map[gid.GID]*coredata.People)

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			if err := document.LoadByID(ctx, conn, s.svc.scope, documentID); err != nil {
				return fmt.Errorf("cannot load document: %w", err)
			}

			if !document.ShowOnTrustCenter {
				return fmt.Errorf("document not visible on trust center")
			}

			if err := version.LoadLatestPublishedVersion(ctx, conn, s.svc.scope, documentID); err != nil {
				return fmt.Errorf("cannot load latest published document version: %w", err)
			}

			if version.PublishedBy != nil {
				if err := publishedBy.LoadByID(ctx, conn, s.svc.scope, *version.PublishedBy); err != nil {
					return fmt.Errorf("cannot load published by person: %w", err)
				}
			}

			cursor := page.NewCursor(
				100,
				nil,
				page.Head,
				page.OrderBy[coredata.DocumentVersionSignatureOrderField]{
					Field:     coredata.DocumentVersionSignatureOrderFieldCreatedAt,
					Direction: page.OrderDirectionAsc,
				},
			)

			if err := signatures.LoadByDocumentVersionID(ctx, conn, s.svc.scope, version.ID, cursor); err != nil {
				return fmt.Errorf("cannot load document version signatures: %w", err)
			}

			if err := owner.LoadByID(ctx, conn, s.svc.scope, document.OwnerID); err != nil {
				return fmt.Errorf("cannot load document owner: %w", err)
			}

			// TODO: refactor this to use a single query
			for _, sig := range signatures {
				if _, ok := peopleMap[sig.SignedBy]; !ok {
					people := &coredata.People{}
					if err := people.LoadByID(ctx, conn, s.svc.scope, sig.SignedBy); err != nil {
						return fmt.Errorf("cannot load people %q: %w", sig.SignedBy, err)
					}
					peopleMap[sig.SignedBy] = people
				}

				if _, ok := peopleMap[sig.RequestedBy]; !ok {
					people := &coredata.People{}
					if err := people.LoadByID(ctx, conn, s.svc.scope, sig.RequestedBy); err != nil {
						return fmt.Errorf("cannot load people %q: %w", sig.RequestedBy, err)
					}
					peopleMap[sig.RequestedBy] = people
				}
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	classification := docgen.ClassificationInternal
	switch document.DocumentType {
	case coredata.DocumentTypePolicy:
		classification = docgen.ClassificationConfidential
	case coredata.DocumentTypeISMS:
		classification = docgen.ClassificationSecret
	}

	docData := docgen.DocumentData{
		Title:          version.Title,
		Content:        version.Content,
		Version:        version.VersionNumber,
		Classification: classification,
		Approver:       owner.FullName,
		Description:    version.Changelog,
		PublishedAt:    version.PublishedAt,
		PublishedBy:    publishedBy.FullName,
		Signatures:     make([]docgen.SignatureData, len(signatures)),
	}

	for i, sig := range signatures {
		docData.Signatures[i] = docgen.SignatureData{
			SignedBy:    peopleMap[sig.SignedBy].FullName,
			SignedAt:    sig.SignedAt,
			State:       sig.State,
			RequestedAt: sig.RequestedAt,
			RequestedBy: peopleMap[sig.RequestedBy].FullName,
		}
	}

	htmlContent, err := docgen.RenderHTML(docData)
	if err != nil {
		return nil, fmt.Errorf("cannot generate HTML: %w", err)
	}

	cfg := html2pdf.RenderConfig{
		PageFormat:      html2pdf.PageFormatA4,
		Orientation:     html2pdf.OrientationPortrait,
		MarginTop:       html2pdf.NewMarginInches(1.0),
		MarginBottom:    html2pdf.NewMarginInches(1.0),
		MarginLeft:      html2pdf.NewMarginInches(1.0),
		MarginRight:     html2pdf.NewMarginInches(1.0),
		PrintBackground: true,
		Scale:           1.0,
	}

	pdfReader, err := s.html2pdfConverter.GeneratePDF(ctx, htmlContent, cfg)
	if err != nil {
		return nil, fmt.Errorf("cannot generate PDF: %w", err)
	}

	pdfData, err := io.ReadAll(pdfReader)
	if err != nil {
		return nil, fmt.Errorf("cannot read PDF data: %w", err)
	}
	return pdfData, nil
}
