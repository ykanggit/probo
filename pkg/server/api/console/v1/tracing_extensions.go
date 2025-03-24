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

package console_v1

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/trace"
)

type tracingExtension struct{}

func (t tracingExtension) ExtensionName() string {
	return "Tracing"
}

func (t tracingExtension) Validate(schema graphql.ExecutableSchema) error {
	return nil
}

func (t tracingExtension) InterceptField(ctx context.Context, next graphql.Resolver) (interface{}, error) {
	rootSpan := trace.SpanFromContext(ctx)

	if rootSpan.IsRecording() {
		tracer := otel.Tracer("graphql-field")
		fieldContext := graphql.GetFieldContext(ctx)

		ctx, span := tracer.Start(ctx, "GraphQL Field: "+fieldContext.Field.Name)
		defer span.End()

		span.SetAttributes(
			attribute.String("graphql.field.name", fieldContext.Field.Name),
			attribute.String("graphql.field.path", fieldContext.Path().String()),
			attribute.String("graphql.field.object", fieldContext.Object),
		)

		result, err := next(ctx)

		if err != nil {
			span.RecordError(err)
		}

		return result, err
	}

	return next(ctx)
}

func (t tracingExtension) InterceptOperation(ctx context.Context, next graphql.OperationHandler) graphql.ResponseHandler {
	rootSpan := trace.SpanFromContext(ctx)

	if rootSpan.IsRecording() {
		tracer := otel.Tracer("graphql-operation")
		requestContext := graphql.GetOperationContext(ctx)
		operationName := "GraphQL Operation"
		if requestContext.OperationName != "" {
			operationName = "GraphQL " + requestContext.OperationName
		}

		ctx, span := tracer.Start(ctx, operationName)
		defer span.End()

		span.SetAttributes(
			attribute.String("graphql.operation_name", requestContext.OperationName),
			attribute.String("graphql.operation_type", string(requestContext.Operation.Operation)),
			attribute.String("graphql.query", requestContext.RawQuery),
		)

		return next(ctx)
	}

	return next(ctx)
}
