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

type (
	MitigationState uint8
)

const (
	MitigationStateNotStarted MitigationState = iota
	MitigationStateInProgress
	MitigationStateNotApplicable
	MitigationStateImplemented
)

func (cs MitigationState) MarshalText() ([]byte, error) {
	return []byte(cs.String()), nil
}

func (cs *MitigationState) UnmarshalText(data []byte) error {
	val := string(data)

	switch val {
	case MitigationStateNotStarted.String():
		*cs = MitigationStateNotStarted
	case MitigationStateInProgress.String():
		*cs = MitigationStateInProgress
	case MitigationStateNotApplicable.String():
		*cs = MitigationStateNotApplicable
	case MitigationStateImplemented.String():
		*cs = MitigationStateImplemented
	default:
		return fmt.Errorf("invalid MitigationState value: %q", val)
	}

	return nil
}

func (cs MitigationState) String() string {
	var val string

	switch cs {
	case MitigationStateNotStarted:
		val = "NOT_STARTED"
	case MitigationStateInProgress:
		val = "IN_PROGRESS"
	case MitigationStateNotApplicable:
		val = "NOT_APPLICABLE"
	case MitigationStateImplemented:
		val = "IMPLEMENTED"
	}

	return val
}

func (cs *MitigationState) Scan(value any) error {
	val, ok := value.(string)
	if !ok {
		return fmt.Errorf("invalid scan source for MitigationState, expected string got %T", value)
	}

	return cs.UnmarshalText([]byte(val))
}

func (cs MitigationState) Value() (driver.Value, error) {
	return cs.String(), nil
}
