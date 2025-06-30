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
	"bytes"
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"

	"archive/tar"
	"compress/gzip"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/getprobo/probo/pkg/coredata"
	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/page"
	"github.com/getprobo/probo/pkg/slug"
	"github.com/xuri/excelize/v2"
	"go.gearno.de/kit/pg"
)

const (
	maxControlsLimit = 10000
	maxItemsLimit    = 1000
	presignExpiry    = 15 * time.Minute
)

type (
	FrameworkService struct {
		svc *TenantService
	}

	CreateFrameworkRequest struct {
		OrganizationID gid.GID
		Name           string
		Description    string
	}

	UpdateFrameworkRequest struct {
		ID          gid.GID
		Name        *string
		Description *string
	}

	ImportFrameworkRequest struct {
		Framework struct {
			ID       string `json:"id"`
			Name     string `json:"name"`
			Controls []struct {
				ID          string `json:"id"`
				Name        string `json:"name"`
				Description string `json:"description"`
			} `json:"controls"`
		}
	}

	soaRowData struct {
		control                *coredata.Control
		applicability          string
		justificationExclusion string
		regulatory             string
		contractual            string
		bestPractice           string
		riskAssessment         string
		securityMeasures       string
		isApplicable           bool
	}
)

func (s FrameworkService) Create(
	ctx context.Context,
	req CreateFrameworkRequest,
) (*coredata.Framework, error) {
	now := time.Now()
	organization := &coredata.Organization{}

	framework := &coredata.Framework{
		ID:          gid.New(s.svc.scope.GetTenantID(), coredata.FrameworkEntityType),
		Name:        req.Name,
		Description: req.Description,
		ReferenceID: slug.Make(req.Name),
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	err := s.svc.pg.WithTx(ctx, func(conn pg.Conn) error {
		if err := organization.LoadByID(ctx, conn, s.svc.scope, req.OrganizationID); err != nil {
			return fmt.Errorf("cannot load organization: %w", err)
		}

		framework.OrganizationID = organization.ID

		if err := framework.Insert(ctx, conn, s.svc.scope); err != nil {
			return fmt.Errorf("cannot insert framework: %w", err)
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return framework, nil
}

func (s FrameworkService) CountForOrganizationID(
	ctx context.Context,
	organizationID gid.GID,
) (int, error) {
	var count int

	err := s.svc.pg.WithConn(ctx, func(conn pg.Conn) (err error) {
		frameworks := &coredata.Frameworks{}
		count, err = frameworks.CountByOrganizationID(ctx, conn, s.svc.scope, organizationID)
		if err != nil {
			return fmt.Errorf("cannot count frameworks: %w", err)
		}
		return nil
	})

	if err != nil {
		return 0, fmt.Errorf("cannot count frameworks: %w", err)
	}

	return count, nil
}

func (s FrameworkService) ListForOrganizationID(
	ctx context.Context,
	organizationID gid.GID,
	cursor *page.Cursor[coredata.FrameworkOrderField],
) (*page.Page[*coredata.Framework, coredata.FrameworkOrderField], error) {
	var frameworks coredata.Frameworks
	organization := &coredata.Organization{}

	err := s.svc.pg.WithConn(ctx, func(conn pg.Conn) error {
		if err := organization.LoadByID(ctx, conn, s.svc.scope, organizationID); err != nil {
			return fmt.Errorf("cannot load organization: %w", err)
		}

		err := frameworks.LoadByOrganizationID(
			ctx,
			conn,
			s.svc.scope,
			organization.ID,
			cursor,
		)
		if err != nil {
			return fmt.Errorf("cannot load frameworks: %w", err)
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return page.NewPage(frameworks, cursor), nil
}

func (s FrameworkService) Get(
	ctx context.Context,
	frameworkID gid.GID,
) (*coredata.Framework, error) {
	framework := &coredata.Framework{}

	err := s.svc.pg.WithConn(ctx, func(conn pg.Conn) error {
		return framework.LoadByID(ctx, conn, s.svc.scope, frameworkID)
	})

	if err != nil {
		return nil, err
	}

	return framework, nil
}

func (s FrameworkService) Update(
	ctx context.Context,
	req UpdateFrameworkRequest,
) (*coredata.Framework, error) {
	framework := &coredata.Framework{ID: req.ID}

	err := s.svc.pg.WithTx(ctx, func(conn pg.Conn) error {
		if err := framework.LoadByID(ctx, conn, s.svc.scope, req.ID); err != nil {
			return fmt.Errorf("cannot load framework: %w", err)
		}

		if req.Name != nil {
			framework.Name = *req.Name
		}

		if req.Description != nil {
			framework.Description = *req.Description
		}

		return framework.Update(ctx, conn, s.svc.scope)
	})
	if err != nil {
		return nil, err
	}

	return framework, nil
}

func (s FrameworkService) Delete(
	ctx context.Context,
	frameworkID gid.GID,
) error {
	framework := &coredata.Framework{}

	return s.svc.pg.WithConn(ctx, func(conn pg.Conn) error {
		return framework.Delete(ctx, conn, s.svc.scope, frameworkID)
	})
}

func (s FrameworkService) Import(
	ctx context.Context,
	organizationID gid.GID,
	req ImportFrameworkRequest,
) (*coredata.Framework, error) {
	var framework *coredata.Framework
	frameworkID := gid.New(organizationID.TenantID(), coredata.FrameworkEntityType)
	now := time.Now()

	err := s.svc.pg.WithTx(ctx, func(tx pg.Conn) error {
		organization := &coredata.Organization{}
		if err := organization.LoadByID(ctx, tx, s.svc.scope, organizationID); err != nil {
			return fmt.Errorf("cannot load organization: %w", err)
		}

		framework = &coredata.Framework{
			ID:             frameworkID,
			OrganizationID: organization.ID,
			ReferenceID:    req.Framework.ID,
			Name:           req.Framework.Name,
			CreatedAt:      now,
			UpdatedAt:      now,
		}

		if err := framework.Insert(ctx, tx, s.svc.scope); err != nil {
			return fmt.Errorf("cannot insert framework: %w", err)
		}

		for _, control := range req.Framework.Controls {
			controlID := gid.New(organization.ID.TenantID(), coredata.ControlEntityType)

			now := time.Now()
			control := &coredata.Control{
				ID:           controlID,
				TenantID:     organizationID.TenantID(),
				FrameworkID:  frameworkID,
				SectionTitle: control.ID,
				Name:         control.Name,
				Description:  control.Description,
				CreatedAt:    now,
				UpdatedAt:    now,
			}

			if err := control.Insert(ctx, tx, s.svc.scope); err != nil {
				return fmt.Errorf("cannot insert control: %w", err)
			}
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return framework, nil
}

func (s FrameworkService) ExportAudit(
	ctx context.Context,
	frameworkID gid.GID,
) (string, error) {
	var archivePath string
	var objectKey string

	err := s.svc.pg.WithConn(ctx, func(conn pg.Conn) error {
		framework := &coredata.Framework{}
		if err := framework.LoadByID(ctx, conn, s.svc.scope, frameworkID); err != nil {
			return fmt.Errorf("cannot load framework: %w", err)
		}

		now := time.Now()
		exportDir := filepath.Join(os.TempDir(), "probo-export", framework.Name, now.Format("2006-01-02-15-04-05"))

		if err := os.MkdirAll(exportDir, 0755); err != nil {
			return fmt.Errorf("cannot create export directory: %w", err)
		}

		controls := coredata.Controls{}
		controlsCursor := page.NewCursor(
			0,
			nil,
			page.Head,
			page.OrderBy[coredata.ControlOrderField]{
				Field:     coredata.ControlOrderFieldCreatedAt,
				Direction: page.OrderDirectionAsc,
			},
		)

		if err := controls.LoadByFrameworkID(ctx, conn, s.svc.scope, frameworkID, controlsCursor, coredata.NewControlFilter(nil)); err != nil {
			return fmt.Errorf("cannot load controls: %w", err)
		}

		for _, control := range controls {
			if err := s.exportControlData(ctx, conn, control, exportDir); err != nil {
				return fmt.Errorf("cannot export control data: %w", err)
			}
		}

		archivePath = exportDir + ".tar.gz"
		if err := createTarGzArchive(exportDir, archivePath); err != nil {
			return fmt.Errorf("cannot create archive: %w", err)
		}
		defer os.Remove(archivePath)

		file, err := os.Open(archivePath)
		if err != nil {
			return fmt.Errorf("cannot open archive file: %w", err)
		}
		defer file.Close()

		objectKey = fmt.Sprintf("exports/%s/%s.tar.gz", frameworkID, now.Format("2006-01-02-15-04-05"))
		_, err = s.svc.s3.PutObject(ctx, &s3.PutObjectInput{
			Bucket: aws.String(s.svc.bucket),
			Key:    aws.String(objectKey),
			Body:   file,
		})
		if err != nil {
			return fmt.Errorf("cannot upload archive to S3: %w", err)
		}

		return nil
	})

	if err != nil {
		return "", err
	}

	presignClient := s3.NewPresignClient(s.svc.s3)

	presignedReq, err := presignClient.PresignGetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(s.svc.bucket),
		Key:    aws.String(objectKey),
	}, func(opts *s3.PresignOptions) {
		opts.Expires = presignExpiry
	})
	if err != nil {
		return "", fmt.Errorf("cannot generate presigned URL: %w", err)
	}

	return presignedReq.URL, nil
}

func (s FrameworkService) exportControlData(ctx context.Context, conn pg.Conn, control *coredata.Control, exportDir string) error {
	controlDir := filepath.Join(exportDir, filepath.Base(control.SectionTitle))
	if err := os.MkdirAll(controlDir, 0755); err != nil {
		return fmt.Errorf("cannot create control directory: %w", err)
	}

	measures, err := s.loadMeasuresForControl(ctx, conn, control.ID)
	if err != nil {
		return fmt.Errorf("cannot load measures: %w", err)
	}

	documents, err := s.loadDocumentsForControl(ctx, conn, control.ID)
	if err != nil {
		return fmt.Errorf("cannot load documents: %w", err)
	}

	if err := s.exportDocuments(ctx, conn, documents, controlDir); err != nil {
		return fmt.Errorf("cannot export documents: %w", err)
	}

	if err := s.exportMeasures(ctx, conn, measures, controlDir); err != nil {
		return fmt.Errorf("cannot export measures: %w", err)
	}

	return nil
}

func (s FrameworkService) loadMeasuresForControl(ctx context.Context, conn pg.Conn, controlID gid.GID) (coredata.Measures, error) {
	measures := coredata.Measures{}
	cursor := page.NewCursor(
		0,
		nil,
		page.Head,
		page.OrderBy[coredata.MeasureOrderField]{
			Field:     coredata.MeasureOrderFieldCreatedAt,
			Direction: page.OrderDirectionAsc,
		},
	)

	err := measures.LoadByControlID(ctx, conn, s.svc.scope, controlID, cursor, coredata.NewMeasureFilter(nil))
	return measures, err
}

func (s FrameworkService) loadDocumentsForControl(ctx context.Context, conn pg.Conn, controlID gid.GID) (coredata.Documents, error) {
	documents := coredata.Documents{}
	cursor := page.NewCursor(
		0,
		nil,
		page.Head,
		page.OrderBy[coredata.DocumentOrderField]{
			Field:     coredata.DocumentOrderFieldCreatedAt,
			Direction: page.OrderDirectionAsc,
		},
	)

	err := documents.LoadByControlID(ctx, conn, s.svc.scope, controlID, cursor, coredata.NewDocumentFilter(nil))
	return documents, err
}

func (s FrameworkService) exportDocuments(ctx context.Context, conn pg.Conn, documents coredata.Documents, controlDir string) error {
	for _, document := range documents {
		documentDir := filepath.Join(controlDir, filepath.Base(document.Title))
		if err := os.MkdirAll(documentDir, 0755); err != nil {
			return fmt.Errorf("cannot create document directory: %w", err)
		}

		version := coredata.DocumentVersion{}
		if err := version.LoadLatestVersion(ctx, conn, s.svc.scope, document.ID); err != nil {
			return fmt.Errorf("cannot load document version: %w", err)
		}

		documentFile := filepath.Join(documentDir, "document.md")
		if err := os.WriteFile(documentFile, []byte(version.Content), 0644); err != nil {
			return fmt.Errorf("cannot write document file: %w", err)
		}
	}
	return nil
}

func (s FrameworkService) exportMeasures(ctx context.Context, conn pg.Conn, measures coredata.Measures, controlDir string) error {
	for _, measure := range measures {
		measureDir := filepath.Join(controlDir, filepath.Base(measure.Name))
		if err := os.MkdirAll(measureDir, 0755); err != nil {
			return fmt.Errorf("cannot create measure directory: %w", err)
		}

		evidences := coredata.Evidences{}
		evidenceCursor := page.NewCursor(
			0,
			nil,
			page.Head,
			page.OrderBy[coredata.EvidenceOrderField]{
				Field:     coredata.EvidenceOrderFieldCreatedAt,
				Direction: page.OrderDirectionAsc,
			},
		)

		if err := evidences.LoadByMeasureID(ctx, conn, s.svc.scope, measure.ID, evidenceCursor); err != nil {
			return fmt.Errorf("cannot load evidences: %w", err)
		}

		for _, evidence := range evidences {
			if err := s.exportEvidence(ctx, evidence, measureDir); err != nil {
				return fmt.Errorf("cannot export evidence: %w", err)
			}
		}
	}
	return nil
}

func (s FrameworkService) exportEvidence(ctx context.Context, evidence *coredata.Evidence, measureDir string) error {
	if evidence.Type != coredata.EvidenceTypeFile || evidence.ObjectKey == "" {
		return nil
	}

	evidenceFile := filepath.Join(measureDir, filepath.Base(evidence.Filename))

	output, err := s.svc.s3.GetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(s.svc.bucket),
		Key:    aws.String(evidence.ObjectKey),
	})
	if err != nil {
		return fmt.Errorf("cannot download evidence file: %w", err)
	}
	defer output.Body.Close()

	file, err := os.Create(evidenceFile)
	if err != nil {
		return fmt.Errorf("cannot create evidence file: %w", err)
	}
	defer file.Close()

	_, err = io.Copy(file, output.Body)
	if err != nil {
		return fmt.Errorf("cannot write evidence file: %w", err)
	}

	return nil
}

func createTarGzArchive(sourceDir, targetFile string) error {
	tarFile, err := os.Create(targetFile)
	if err != nil {
		return fmt.Errorf("could not create archive file: %w", err)
	}
	defer tarFile.Close()

	gzipWriter := io.Writer(tarFile)
	gzw := gzip.NewWriter(gzipWriter)
	defer gzw.Close()

	tarWriter := tar.NewWriter(gzw)
	defer tarWriter.Close()

	err = filepath.Walk(sourceDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		header, err := tar.FileInfoHeader(info, info.Name())
		if err != nil {
			return fmt.Errorf("could not create tar header: %w", err)
		}

		relPath, err := filepath.Rel(sourceDir, path)
		if err != nil {
			return fmt.Errorf("could not get relative path: %w", err)
		}
		header.Name = relPath

		if err := tarWriter.WriteHeader(header); err != nil {
			return fmt.Errorf("could not write tar header: %w", err)
		}

		if info.Mode().IsRegular() {
			file, err := os.Open(path)
			if err != nil {
				return fmt.Errorf("could not open file %s: %w", path, err)
			}
			defer file.Close()

			if _, err := io.Copy(tarWriter, file); err != nil {
				return fmt.Errorf("could not copy file content: %w", err)
			}
		}

		return nil
	})

	return err
}

func (s FrameworkService) StateOfApplicability(ctx context.Context, frameworkID gid.GID) (string, error) {
	framework := &coredata.Framework{}
	var presignedURL string

	err := s.svc.pg.WithConn(ctx, func(conn pg.Conn) error {
		if err := framework.LoadByID(ctx, conn, s.svc.scope, frameworkID); err != nil {
			return fmt.Errorf("cannot load framework: %w", err)
		}

		controls, err := s.loadAllControlsForFramework(ctx, conn, frameworkID)
		if err != nil {
			return err
		}

		soaData, err := s.buildSOAData(ctx, conn, controls)
		if err != nil {
			return err
		}

		excelReader, err := s.createSOAExcelFile(soaData)
		if err != nil {
			return err
		}

		// Upload to S3 and get presigned URL
		presignedURL, err = s.uploadSOAToS3(ctx, framework, excelReader)
		if err != nil {
			return fmt.Errorf("cannot upload SOA to S3: %w", err)
		}

		return nil
	})

	if err != nil {
		return "", err
	}

	return presignedURL, nil
}

func (s FrameworkService) loadAllControlsForFramework(ctx context.Context, conn pg.Conn, frameworkID gid.GID) (coredata.Controls, error) {
	controls := coredata.Controls{}
	controlsCursor := page.NewCursor(
		maxControlsLimit,
		nil,
		page.Head,
		page.OrderBy[coredata.ControlOrderField]{
			Field:     coredata.ControlOrderFieldSectionTitle,
			Direction: page.OrderDirectionAsc,
		},
	)

	if err := controls.LoadByFrameworkID(ctx, conn, s.svc.scope, frameworkID, controlsCursor, coredata.NewControlFilter(nil)); err != nil {
		return nil, fmt.Errorf("cannot load controls: %w", err)
	}

	return controls, nil
}

func (s FrameworkService) buildSOAData(ctx context.Context, conn pg.Conn, controls coredata.Controls) ([]soaRowData, error) {
	var soaData []soaRowData

	for _, control := range controls {
		if control == nil {
			continue
		}

		rowData, err := s.buildSOARowData(ctx, conn, control)
		if err != nil {
			return nil, fmt.Errorf("cannot build SOA row data for control %s: %w", control.ID, err)
		}

		soaData = append(soaData, rowData)
	}

	return soaData, nil
}

func (s FrameworkService) buildSOARowData(ctx context.Context, conn pg.Conn, control *coredata.Control) (soaRowData, error) {
	measures, err := s.loadMeasuresForControl(ctx, conn, control.ID)
	if err != nil {
		return soaRowData{}, fmt.Errorf("cannot load measures: %w", err)
	}

	policies, err := s.loadDocumentsForControl(ctx, conn, control.ID)
	if err != nil {
		return soaRowData{}, fmt.Errorf("cannot load policies: %w", err)
	}

	hasEvidence := false
	for _, measure := range measures {
		if measure == nil {
			continue
		}

		evidences := coredata.Evidences{}
		evidencesCursor := page.NewCursor(
			maxItemsLimit,
			nil,
			page.Head,
			page.OrderBy[coredata.EvidenceOrderField]{
				Field:     coredata.EvidenceOrderFieldCreatedAt,
				Direction: page.OrderDirectionAsc,
			},
		)

		if err := evidences.LoadByMeasureID(ctx, conn, s.svc.scope, measure.ID, evidencesCursor); err != nil {
			continue
		}

		if len(evidences) > 0 {
			hasEvidence = true
			break
		}
	}

	rowData := soaRowData{
		control: control,
	}

	if len(measures) > 0 || len(policies) > 0 {
		rowData.applicability = "Yes"
		rowData.isApplicable = true
		rowData.regulatory = "YES"
		rowData.bestPractice = "YES"

		if hasEvidence {
			rowData.riskAssessment = "YES"
		}

		var measuresList []string
		for _, measure := range measures {
			if measure != nil {
				measuresList = append(measuresList, "• "+measure.Name)
			}
		}
		for _, policy := range policies {
			if policy != nil {
				measuresList = append(measuresList, "• "+policy.Title)
			}
		}
		rowData.securityMeasures = strings.Join(measuresList, "\n")
	} else {
		rowData.applicability = "No"
		rowData.isApplicable = false
		rowData.justificationExclusion = "Not applicable to current business operations"
	}

	return rowData, nil
}

func (s FrameworkService) createSOAExcelFile(soaData []soaRowData) (io.Reader, error) {
	f := excelize.NewFile()
	if err := f.Close(); err != nil {
		return nil, fmt.Errorf("cannot close Excel file: %w", err)
	}

	sheetName := "State of Applicability"
	f.SetSheetName("Sheet1", sheetName)

	styles, err := s.createExcelStyles(f)
	if err != nil {
		return nil, fmt.Errorf("cannot create Excel styles: %w", err)
	}

	if err := s.setupExcelHeader(f, sheetName, styles); err != nil {
		return nil, fmt.Errorf("cannot setup Excel header: %w", err)
	}

	if err := s.populateExcelData(f, sheetName, soaData, styles); err != nil {
		return nil, fmt.Errorf("cannot populate Excel data: %w", err)
	}

	if err := s.applyExcelFormatting(f, sheetName, len(soaData)); err != nil {
		return nil, fmt.Errorf("cannot apply Excel formatting: %w", err)
	}

	// Write to buffer
	buffer, err := f.WriteToBuffer()
	if err != nil {
		return nil, fmt.Errorf("cannot write Excel file to buffer: %w", err)
	}

	// Convert to bytes.Reader for seekability (required by S3 SDK)
	return bytes.NewReader(buffer.Bytes()), nil
}

func (s FrameworkService) createExcelStyles(f *excelize.File) (map[string]int, error) {
	styles := make(map[string]int)

	headerStyle, err := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{Bold: true, Size: 10, Color: "#000000"},
		Fill: excelize.Fill{Type: "pattern", Color: []string{"#D9D9D9"}, Pattern: 1},
		Border: []excelize.Border{
			{Type: "left", Color: "#000000", Style: 1},
			{Type: "top", Color: "#000000", Style: 1},
			{Type: "bottom", Color: "#000000", Style: 1},
			{Type: "right", Color: "#000000", Style: 1},
		},
		Alignment: &excelize.Alignment{Horizontal: "center", Vertical: "center", WrapText: true},
	})
	if err != nil {
		return nil, err
	}
	styles["header"] = headerStyle

	cellStyle, err := f.NewStyle(&excelize.Style{
		Border: []excelize.Border{
			{Type: "left", Color: "#000000", Style: 1},
			{Type: "top", Color: "#000000", Style: 1},
			{Type: "bottom", Color: "#000000", Style: 1},
			{Type: "right", Color: "#000000", Style: 1},
		},
		Alignment: &excelize.Alignment{Horizontal: "center", Vertical: "center", WrapText: true},
	})
	if err != nil {
		return nil, err
	}
	styles["cell"] = cellStyle

	textCellStyle, err := f.NewStyle(&excelize.Style{
		Border: []excelize.Border{
			{Type: "left", Color: "#000000", Style: 1},
			{Type: "top", Color: "#000000", Style: 1},
			{Type: "bottom", Color: "#000000", Style: 1},
			{Type: "right", Color: "#000000", Style: 1},
		},
		Alignment: &excelize.Alignment{Horizontal: "left", Vertical: "center", WrapText: true},
	})
	if err != nil {
		return nil, err
	}
	styles["textCell"] = textCellStyle

	greenApplicabilityStyle, err := f.NewStyle(&excelize.Style{
		Border: []excelize.Border{
			{Type: "left", Color: "#000000", Style: 1},
			{Type: "top", Color: "#000000", Style: 1},
			{Type: "bottom", Color: "#000000", Style: 1},
			{Type: "right", Color: "#000000", Style: 1},
		},
		Fill:      excelize.Fill{Type: "pattern", Color: []string{"#90EE90"}, Pattern: 1},
		Alignment: &excelize.Alignment{Horizontal: "center", Vertical: "center", WrapText: true},
	})
	if err != nil {
		return nil, err
	}
	styles["greenApplicability"] = greenApplicabilityStyle

	redApplicabilityStyle, err := f.NewStyle(&excelize.Style{
		Border: []excelize.Border{
			{Type: "left", Color: "#000000", Style: 1},
			{Type: "top", Color: "#000000", Style: 1},
			{Type: "bottom", Color: "#000000", Style: 1},
			{Type: "right", Color: "#000000", Style: 1},
		},
		Fill:      excelize.Fill{Type: "pattern", Color: []string{"#FFB6C1"}, Pattern: 1},
		Alignment: &excelize.Alignment{Horizontal: "center", Vertical: "center", WrapText: true},
	})
	if err != nil {
		return nil, err
	}
	styles["redApplicability"] = redApplicabilityStyle

	return styles, nil
}

func (s FrameworkService) setupExcelHeader(f *excelize.File, sheetName string, styles map[string]int) error {
	// Version, Date, Comment, Author, Approver header
	f.SetCellValue(sheetName, "A2", "Version")
	f.SetCellValue(sheetName, "C2", "Date")
	f.SetCellValue(sheetName, "D2", "Comment")
	f.SetCellValue(sheetName, "E2", "Author")
	f.SetCellValue(sheetName, "F2", "Approver")

	// Sample data for header
	f.SetCellValue(sheetName, "A3", "1.0")
	f.SetCellValue(sheetName, "C3", time.Now().Format("01/02/2006"))
	f.SetCellValue(sheetName, "D3", "Initial SoA")
	f.SetCellValue(sheetName, "E3", "System Admin")
	f.SetCellValue(sheetName, "F3", "Security Manager")

	// Apply header styles
	for _, cell := range []string{"A2", "C2", "D2", "E2", "F2"} {
		f.SetCellStyle(sheetName, cell, cell, styles["header"])
	}
	for _, cell := range []string{"A3", "C3", "D3", "E3", "F3"} {
		f.SetCellStyle(sheetName, cell, cell, styles["cell"])
	}

	// Main table headers (row 6-7)
	f.SetCellValue(sheetName, "A6", "Control")
	f.SetCellValue(sheetName, "B6", "Control name")
	f.SetCellValue(sheetName, "C6", "Applicability")
	f.SetCellValue(sheetName, "D6", "Justification for exclusion")
	f.SetCellValue(sheetName, "E6", "Justification for inclusion")
	f.SetCellValue(sheetName, "I6", "List of security measure or policy")

	// Sub headers for "Justification for inclusion"
	f.SetCellValue(sheetName, "E7", "Regulatory")
	f.SetCellValue(sheetName, "F7", "Contractual")
	f.SetCellValue(sheetName, "G7", "Best practice")
	f.SetCellValue(sheetName, "H7", "Risk assessment")

	// Merge cells for main headers
	f.MergeCell(sheetName, "A6", "A7")
	f.MergeCell(sheetName, "B6", "B7")
	f.MergeCell(sheetName, "C6", "C7")
	f.MergeCell(sheetName, "D6", "D7")
	f.MergeCell(sheetName, "E6", "H6")
	f.MergeCell(sheetName, "I6", "I7")

	// Apply header styles
	headerCells := []string{"A6", "A7", "B6", "B7", "C6", "C7", "D6", "D7", "E6", "I6", "I7", "E6", "E7", "F6", "F7", "G6", "G7", "H6", "H7"}
	for _, cell := range headerCells {
		f.SetCellStyle(sheetName, cell, cell, styles["header"])
	}

	return nil
}

func (s FrameworkService) populateExcelData(f *excelize.File, sheetName string, soaData []soaRowData, styles map[string]int) error {
	currentRow := 8

	for _, rowData := range soaData {
		control := rowData.control

		f.SetCellValue(sheetName, fmt.Sprintf("A%d", currentRow), control.SectionTitle)
		f.SetCellValue(sheetName, fmt.Sprintf("B%d", currentRow), control.Name)
		f.SetCellValue(sheetName, fmt.Sprintf("C%d", currentRow), rowData.applicability)
		f.SetCellValue(sheetName, fmt.Sprintf("D%d", currentRow), rowData.justificationExclusion)
		f.SetCellValue(sheetName, fmt.Sprintf("E%d", currentRow), rowData.regulatory)
		f.SetCellValue(sheetName, fmt.Sprintf("F%d", currentRow), rowData.contractual)
		f.SetCellValue(sheetName, fmt.Sprintf("G%d", currentRow), rowData.bestPractice)
		f.SetCellValue(sheetName, fmt.Sprintf("H%d", currentRow), rowData.riskAssessment)
		f.SetCellValue(sheetName, fmt.Sprintf("I%d", currentRow), rowData.securityMeasures)

		// Apply appropriate styles
		for col := 'A'; col <= 'I'; col++ {
			cellRef := fmt.Sprintf("%c%d", col, currentRow)
			if col == 'C' { // Applicability column
				if rowData.isApplicable {
					f.SetCellStyle(sheetName, cellRef, cellRef, styles["greenApplicability"])
				} else {
					f.SetCellStyle(sheetName, cellRef, cellRef, styles["redApplicability"])
				}
			} else if col >= 'E' && col <= 'H' { // Justification columns
				f.SetCellStyle(sheetName, cellRef, cellRef, styles["cell"])
			} else { // Other columns
				f.SetCellStyle(sheetName, cellRef, cellRef, styles["textCell"])
			}
		}

		currentRow++
	}

	return nil
}

func (s FrameworkService) applyExcelFormatting(f *excelize.File, sheetName string, dataRowCount int) error {
	if dataRowCount == 0 {
		return nil
	}

	lastRow := 8 + dataRowCount - 1

	// Add data validation for Applicability column
	dvRange := fmt.Sprintf("C8:C%d", lastRow)
	dv := excelize.NewDataValidation(true)
	dv.Sqref = dvRange
	dv.SetDropList([]string{"Yes", "No"})
	dv.SetError(excelize.DataValidationErrorStyleStop, "Invalid Input", "Please select Yes or No from the dropdown list.")
	if err := f.AddDataValidation(sheetName, dv); err != nil {
		return fmt.Errorf("failed to add data validation: %w", err)
	}

	// Add data validation for justification columns
	for _, col := range []string{"E", "F", "G", "H"} {
		dvRange := fmt.Sprintf("%s8:%s%d", col, col, lastRow)
		dv := excelize.NewDataValidation(true)
		dv.Sqref = dvRange
		dv.SetDropList([]string{"YES", "NO", ""})
		dv.SetError(excelize.DataValidationErrorStyleStop, "Invalid Input", "Please select YES, NO, or leave empty.")
		if err := f.AddDataValidation(sheetName, dv); err != nil {
			return fmt.Errorf("failed to add data validation for column %s: %w", col, err)
		}
	}

	// Add auto-filter
	filterRange := fmt.Sprintf("A6:I%d", lastRow)
	if err := f.AutoFilter(sheetName, filterRange, []excelize.AutoFilterOptions{}); err != nil {
		return fmt.Errorf("failed to add auto-filter: %w", err)
	}

	// Set column widths
	f.SetColWidth(sheetName, "A", "A", 12)
	f.SetColWidth(sheetName, "B", "B", 35)
	f.SetColWidth(sheetName, "C", "C", 12)
	f.SetColWidth(sheetName, "D", "D", 25)
	f.SetColWidth(sheetName, "E", "E", 12)
	f.SetColWidth(sheetName, "F", "F", 12)
	f.SetColWidth(sheetName, "G", "G", 12)
	f.SetColWidth(sheetName, "H", "H", 12)
	f.SetColWidth(sheetName, "I", "I", 40)

	// Set row heights for better visibility
	f.SetRowHeight(sheetName, 6, 30)
	f.SetRowHeight(sheetName, 7, 30)

	return nil
}

func (s FrameworkService) generateSOAFileName(framework *coredata.Framework) string {
	now := time.Now()

	// Sanitize framework name by replacing invalid file name characters
	sanitizedName := framework.Name
	invalidChars := []string{"/", "\\", ":", "*", "?", "\"", "<", ">", "|", " "}
	for _, char := range invalidChars {
		sanitizedName = strings.ReplaceAll(sanitizedName, char, "_")
	}

	return fmt.Sprintf("SOA_%s_%s.xlsx",
		sanitizedName,
		now.Format("20060102_150405"))
}

func (s FrameworkService) uploadSOAToS3(ctx context.Context, framework *coredata.Framework, excelReader io.Reader) (string, error) {
	objectKey := fmt.Sprintf("soa/%s/%s", framework.ID, s.generateSOAFileName(framework))

	// Upload file to S3 using bytes reader
	_, err := s.svc.s3.PutObject(ctx, &s3.PutObjectInput{
		Bucket: aws.String(s.svc.bucket),
		Key:    aws.String(objectKey),
		Body:   excelReader,
	})
	if err != nil {
		return "", fmt.Errorf("cannot upload SOA file to S3: %w", err)
	}

	// Generate presigned URL
	presignClient := s3.NewPresignClient(s.svc.s3)
	presignedReq, err := presignClient.PresignGetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(s.svc.bucket),
		Key:    aws.String(objectKey),
	}, func(opts *s3.PresignOptions) {
		opts.Expires = presignExpiry
	})
	if err != nil {
		return "", fmt.Errorf("cannot generate presigned URL: %w", err)
	}

	return presignedReq.URL, nil
}
