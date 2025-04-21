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

package coredata

import (
	"database/sql/driver"
	"fmt"
)

func (bi BusinessImpact) MarshalText() ([]byte, error) {
	return []byte(bi.String()), nil
}

func (bi *BusinessImpact) UnmarshalText(data []byte) error {
	val := string(data)

	switch val {
	case BusinessImpactLow.String():
		*bi = BusinessImpactLow
	case BusinessImpactMedium.String():
		*bi = BusinessImpactMedium
	case BusinessImpactHigh.String():
		*bi = BusinessImpactHigh
	case BusinessImpactCritical.String():
		*bi = BusinessImpactCritical
	default:
		return fmt.Errorf("invalid BusinessImpact value: %q", val)
	}

	return nil
}

func (bi BusinessImpact) String() string {
	return string(bi)
}

func (bi *BusinessImpact) Scan(value any) error {
	val, ok := value.(string)
	if !ok {
		return fmt.Errorf("invalid scan source for BusinessImpact, expected string got %T", value)
	}

	return bi.UnmarshalText([]byte(val))
}

func (bi BusinessImpact) Value() (driver.Value, error) {
	return bi.String(), nil
}
