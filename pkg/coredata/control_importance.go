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
	"encoding/json"
	"fmt"
)

type ControlImportance uint8

const (
	ControlImportanceMandatory ControlImportance = iota
	ControlImportancePreferred
	ControlImportanceAdvanced
)

func (i ControlImportance) String() string {
	return []string{"MANDATORY", "PREFERRED", "ADVANCED"}[i]
}

func (i *ControlImportance) Scan(value interface{}) error {
	switch v := value.(type) {
	case uint8:
		*i = ControlImportance(v)
	case string:
		switch v {
		case "MANDATORY":
			*i = ControlImportanceMandatory
		case "PREFERRED":
			*i = ControlImportancePreferred
		case "ADVANCED":
			*i = ControlImportanceAdvanced
		default:
			return fmt.Errorf("invalid ControlImportance value: %q", v)
		}
	default:
		return fmt.Errorf("unsupported type for ControlImportance: %T", value)
	}
	return nil
}

func (i ControlImportance) Value() (driver.Value, error) {
	return i.String(), nil
}

func (i ControlImportance) MarshalJSON() ([]byte, error) {
	return json.Marshal(i.String())
}

func (i *ControlImportance) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}

	switch s {
	case "MANDATORY":
		*i = ControlImportanceMandatory
	case "PREFERRED":
		*i = ControlImportancePreferred
	case "ADVANCED":
		*i = ControlImportanceAdvanced
	default:
		return fmt.Errorf("invalid ControlImportance value: %q", s)
	}
	return nil
}

func (i *ControlImportance) UnmarshalText(text []byte) error {
	var s string
	if err := json.Unmarshal(text, &s); err != nil {
		return err
	}

	switch s {
	case "MANDATORY":
		*i = ControlImportanceMandatory
	case "PREFERRED":
		*i = ControlImportancePreferred
	case "ADVANCED":
		*i = ControlImportanceAdvanced
	default:
		return fmt.Errorf("invalid ControlImportance value: %q", s)
	}
	return nil
}
