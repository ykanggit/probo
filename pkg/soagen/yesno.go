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

package soagen

import "github.com/xuri/excelize/v2"

// YesNo represents a YES/NO/Empty value
type YesNo string

const (
	Yes   YesNo = "YES"
	No    YesNo = "NO"
	Empty YesNo = ""
)

// String returns the string representation of YesNo
func (yn YesNo) String() string {
	return string(yn)
}

// MarshalExcel implements ExcelMarshaler for YesNo
func (yn YesNo) MarshalExcel() ExcelValue {
	return ExcelValue{
		Value: yn.String(),
		Style: &excelize.Style{
			Border: []excelize.Border{
				{Type: "left", Color: "#000000", Style: 1},
				{Type: "top", Color: "#000000", Style: 1},
				{Type: "bottom", Color: "#000000", Style: 1},
				{Type: "right", Color: "#000000", Style: 1},
			},
			Alignment: &excelize.Alignment{Horizontal: "center", Vertical: "center", WrapText: true},
		},
		Validation: []string{string(Yes), string(No), string(Empty)},
		Width:      12,
	}
}

// boolToYesNo converts *bool to YesNo type for Excel output
func boolToYesNo(b *bool) YesNo {
	if b == nil {
		return Empty
	}
	if *b {
		return Yes
	}
	return No
}
