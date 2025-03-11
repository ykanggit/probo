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

type RiskTier string

const (
	RiskTierCritical    RiskTier = "CRITICAL"    // Handles sensitive data, critical for platform operation
	RiskTierSignificant RiskTier = "SIGNIFICANT" // No user data access, but important for platform management
	RiskTierGeneral     RiskTier = "GENERAL"     // General vendor with minimal risk
)

func (rt RiskTier) MarshalText() ([]byte, error) {
	return []byte(rt.String()), nil
}

func (rt *RiskTier) UnmarshalText(data []byte) error {
	val := string(data)

	switch val {
	case RiskTierCritical.String():
		*rt = RiskTierCritical
	case RiskTierSignificant.String():
		*rt = RiskTierSignificant
	case RiskTierGeneral.String():
		*rt = RiskTierGeneral
	default:
		return fmt.Errorf("invalid RiskTier value: %q", val)
	}

	return nil
}

func (rt RiskTier) String() string {
	return string(rt)
}

func (rt *RiskTier) Scan(value any) error {
	val, ok := value.(string)
	if !ok {
		return fmt.Errorf("invalid scan source for RiskTier, expected string got %T", value)
	}

	return rt.UnmarshalText([]byte(val))
}

func (rt RiskTier) Value() (driver.Value, error) {
	return rt.String(), nil
}
