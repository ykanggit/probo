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

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/getprobo/probo/pkg/coredata"
	"github.com/getprobo/probo/pkg/gid"
	"go.gearno.de/crypto/uuid"
	"go.gearno.de/kit/pg"
)

type ReportService struct {
	svc *TenantService
}

func (s ReportService) Get(
	ctx context.Context,
	reportID gid.GID,
) (*coredata.Report, error) {
	report := &coredata.Report{}

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			err := report.LoadByID(ctx, conn, s.svc.scope, reportID)
			if err != nil {
				return fmt.Errorf("cannot load report: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return report, nil
}

func (s ReportService) Create(
	ctx context.Context,
	file File,
) (*coredata.Report, error) {
	reportID := gid.New(s.svc.scope.GetTenantID(), coredata.ReportEntityType)
	now := time.Now()

	objectKey, err := uuid.NewV7()
	if err != nil {
		return nil, fmt.Errorf("cannot generate object key: %w", err)
	}

	_, err = s.svc.s3.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(s.svc.bucket),
		Key:         aws.String(objectKey.String()),
		Body:        file.Content,
		ContentType: aws.String(file.ContentType),
		Metadata: map[string]string{
			"report-id": reportID.String(),
		},
	})
	if err != nil {
		return nil, fmt.Errorf("cannot upload report to S3: %w", err)
	}

	report := &coredata.Report{
		ID:        reportID,
		ObjectKey: objectKey.String(),
		MimeType:  file.ContentType,
		Filename:  file.Filename,
		Size:      file.Size,
		CreatedAt: now,
		UpdatedAt: now,
	}

	err = s.svc.pg.WithConn(ctx, func(conn pg.Conn) error {
		err := report.Insert(ctx, conn, s.svc.scope)
		if err != nil {
			return fmt.Errorf("cannot insert report: %w", err)
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return report, nil
}

func (s ReportService) Delete(
	ctx context.Context,
	reportID gid.GID,
) error {
	return s.svc.pg.WithTx(ctx, func(conn pg.Conn) error {
		report := &coredata.Report{}
		err := report.LoadByID(ctx, conn, s.svc.scope, reportID)
		if err != nil {
			return fmt.Errorf("cannot get report: %w", err)
		}

		_, err = s.svc.s3.DeleteObject(ctx, &s3.DeleteObjectInput{
			Bucket: aws.String(s.svc.bucket),
			Key:    aws.String(report.ObjectKey),
		})
		if err != nil {
			return fmt.Errorf("cannot delete report from S3: %w", err)
		}

		err = report.Delete(ctx, conn, s.svc.scope)
		if err != nil {
			return fmt.Errorf("cannot delete report: %w", err)
		}

		return nil
	})
}

func (s ReportService) GenerateDownloadURL(
	ctx context.Context,
	reportID gid.GID,
	expiresIn time.Duration,
) (*string, error) {
	report, err := s.Get(ctx, reportID)
	if err != nil {
		return nil, fmt.Errorf("cannot get report: %w", err)
	}

	presignClient := s3.NewPresignClient(s.svc.s3)

	presignedReq, err := presignClient.PresignGetObject(ctx, &s3.GetObjectInput{
		Bucket:                     aws.String(s.svc.bucket),
		Key:                        aws.String(report.ObjectKey),
		ResponseCacheControl:       aws.String("max-age=3600, public"),
		ResponseContentType:        aws.String(report.MimeType),
		ResponseContentDisposition: aws.String(fmt.Sprintf("attachment; filename=\"%s\"", report.Filename)),
	}, func(opts *s3.PresignOptions) {
		opts.Expires = expiresIn
	})
	if err != nil {
		return nil, fmt.Errorf("cannot presign GetObject request: %w", err)
	}

	return &presignedReq.URL, nil
}
