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

import (
	"fmt"
	"time"

	"github.com/xuri/excelize/v2"
)

type HeaderCell struct {
	Cell  string
	Value string
	Style string // "header" or "cell"
}

type MergedCell struct {
	StartCell string
	EndCell   string
}

type HeaderLayout struct {
	InfoHeader []HeaderCell
	InfoData   []HeaderCell
	MainHeader []HeaderCell
	SubHeader  []HeaderCell
	Merges     []MergedCell
}

func getSOAHeaderLayout() HeaderLayout {
	return HeaderLayout{
		InfoHeader: []HeaderCell{
			{"A2", "Version", "header"},
			{"C2", "Date", "header"},
			{"D2", "Comment", "header"},
			{"E2", "Author", "header"},
			{"F2", "Approver", "header"},
		},
		InfoData: []HeaderCell{
			{"A3", "1.0", "cell"},
			{"C3", time.Now().Format("01/02/2006"), "cell"},
			{"D3", "Initial SoA", "cell"},
			{"E3", "System Admin", "cell"},
			{"F3", "Security Manager", "cell"},
		},
		MainHeader: []HeaderCell{
			{"A6", "Control", "header"},
			{"B6", "Control name", "header"},
			{"C6", "Applicability", "header"},
			{"D6", "Justification for exclusion", "header"},
			{"E6", "Justification for inclusion", "header"},
			{"F6", "Justification for inclusion", "header"},
			{"G6", "Justification for inclusion", "header"},
			{"H6", "Justification for inclusion", "header"},
			{"I6", "List of security measure or policy", "header"},
		},
		SubHeader: []HeaderCell{
			{"A7", "Control", "header"},
			{"B7", "Control name", "header"},
			{"C7", "Applicability", "header"},
			{"D7", "Justification for exclusion", "header"},
			{"E7", "Regulatory", "header"},
			{"F7", "Contractual", "header"},
			{"G7", "Best practice", "header"},
			{"H7", "Risk assessment", "header"},
			{"I7", "List of security measure or policy", "header"},
		},
		Merges: []MergedCell{
			{"A6", "A7"},
			{"B6", "B7"},
			{"C6", "C7"},
			{"D6", "D7"},
			{"E6", "H6"},
			{"I6", "I7"},
		},
	}
}

func applyHeaderLayout(f *excelize.File, sheetName string, layout HeaderLayout, headerStyle, cellStyle int) error {
	if err := applyCells(f, sheetName, layout.InfoHeader, headerStyle, cellStyle); err != nil {
		return err
	}

	if err := applyCells(f, sheetName, layout.InfoData, headerStyle, cellStyle); err != nil {
		return err
	}

	if err := applyCells(f, sheetName, layout.MainHeader, headerStyle, cellStyle); err != nil {
		return err
	}

	if err := applyCells(f, sheetName, layout.SubHeader, headerStyle, cellStyle); err != nil {
		return err
	}

	for _, merge := range layout.Merges {
		if err := f.MergeCell(sheetName, merge.StartCell, merge.EndCell); err != nil {
			return err
		}
	}

	return nil
}

func applyCells(f *excelize.File, sheetName string, cells []HeaderCell, headerStyle, cellStyle int) error {
	for _, cell := range cells {
		if err := f.SetCellValue(sheetName, cell.Cell, cell.Value); err != nil {
			return fmt.Errorf("cannot set cell value: %w", err)
		}

		style := cellStyle
		if cell.Style == "header" {
			style = headerStyle
		}

		if err := f.SetCellStyle(sheetName, cell.Cell, cell.Cell, style); err != nil {
			return fmt.Errorf("cannot set cell style: %w", err)
		}
	}
	return nil
}
