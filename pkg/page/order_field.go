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

package page

import (
	"fmt"
)

type (
	OrderField interface {
		Column() string
	}

	GenericOrderField string
)

const (
	OrderFieldCreatedAt GenericOrderField = "CREATED_AT"
	OrderFieldUpdatedAt GenericOrderField = "UPDATED_AT"
	OrderFieldName      GenericOrderField = "NAME"
)

func (of GenericOrderField) String() string {
	return string(of)
}

func (of GenericOrderField) Column() string {
	switch of {
	case OrderFieldCreatedAt:
		return "created_at"
	case OrderFieldUpdatedAt:
		return "updated_at"
	case OrderFieldName:
		return "name"
	default:
		return ""
	}
}

func (of GenericOrderField) MarshalText() ([]byte, error) {
	return []byte(of.String()), nil
}

func (of *GenericOrderField) UnmarshalText(data []byte) error {
	val := string(data)

	switch val {
	case OrderFieldCreatedAt.String():
		*of = OrderFieldCreatedAt
	case OrderFieldUpdatedAt.String():
		*of = OrderFieldUpdatedAt
	case OrderFieldName.String():
		*of = OrderFieldName
	default:
		return fmt.Errorf("invalid GenericOrderField value: %q", val)
	}

	return nil
}
