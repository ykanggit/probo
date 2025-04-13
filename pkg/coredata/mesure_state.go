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
	MesureState uint8
)

const (
	MesureStateNotStarted MesureState = iota
	MesureStateInProgress
	MesureStateNotApplicable
	MesureStateImplemented
)

func (ms MesureState) MarshalText() ([]byte, error) {
	return []byte(ms.String()), nil
}

func (ms *MesureState) UnmarshalText(data []byte) error {
	val := string(data)

	switch val {
	case MesureStateNotStarted.String():
		*ms = MesureStateNotStarted
	case MesureStateInProgress.String():
		*ms = MesureStateInProgress
	case MesureStateNotApplicable.String():
		*ms = MesureStateNotApplicable
	case MesureStateImplemented.String():
		*ms = MesureStateImplemented
	default:
		return fmt.Errorf("invalid MesureState value: %q", val)
	}

	return nil
}

func (ms MesureState) String() string {
	var val string

	switch ms {
	case MesureStateNotStarted:
		val = "NOT_STARTED"
	case MesureStateInProgress:
		val = "IN_PROGRESS"
	case MesureStateNotApplicable:
		val = "NOT_APPLICABLE"
	case MesureStateImplemented:
		val = "IMPLEMENTED"
	}

	return val
}

func (ms *MesureState) Scan(value any) error {
	val, ok := value.(string)
	if !ok {
		return fmt.Errorf("invalid scan source for MesureState, expected string got %T", value)
	}

	return ms.UnmarshalText([]byte(val))
}

func (ms MesureState) Value() (driver.Value, error) {
	return ms.String(), nil
}
