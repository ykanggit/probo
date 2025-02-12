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
	"encoding/base64"
	"encoding/binary"
	"errors"
	"time"

	"github.com/getprobo/probo/pkg/gid"
)

type (
	CursorKey [byteLength]byte
)

var (
	CursorKeyNil CursorKey

	ErrInvalidFormat = errors.New("invalid format")
)

const (
	byteLength = 24
)

func ParseCursorKey(s string) (CursorKey, error) {
	b, err := base64.RawURLEncoding.DecodeString(s)
	if err != nil {
		return CursorKeyNil, ErrInvalidFormat
	}

	ck, err := CursorKeyFromBytes(b)
	if err != nil {
		return CursorKeyNil, ErrInvalidFormat
	}

	return ck, nil
}

func CursorKeyFromBytes(b []byte) (CursorKey, error) {
	var ck CursorKey

	if len(b) != byteLength {
		return CursorKeyNil, ErrInvalidFormat
	}

	copy(ck[:], b)

	return ck, nil
}

func NewCursorKey(id gid.GID, t time.Time) CursorKey {
	var cursorKey CursorKey
	copy(cursorKey[:16], id[:])
	_ = binary.PutVarint(cursorKey[16:], t.UnixMicro())

	return cursorKey
}

func (ck CursorKey) Bytes() []byte {
	return ck[:]
}

func (ck CursorKey) String() string {
	return base64.RawURLEncoding.EncodeToString(ck.Bytes())
}

func (ck CursorKey) Timestamp() time.Time {
	unixMicro, _ := binary.Varint(ck[16:])

	seconds := unixMicro / 1e6
	nanoseconds := (unixMicro % 1e6) * 1e3

	return time.Unix(seconds, nanoseconds)
}

func (ck CursorKey) ID() gid.GID {
	return gid.GID(ck[:16])
}

func (ck CursorKey) MarshalText() ([]byte, error) {
	return []byte(ck.String()), nil
}

func (ck *CursorKey) UnmarshalText(data []byte) error {
	ck2, err := ParseCursorKey(string(data))
	if err != nil {
		return err
	}

	*ck = ck2

	return nil
}

func (ck CursorKey) MarshalBinary() ([]byte, error) {
	return ck.Bytes(), nil
}

func (ck *CursorKey) UnmarshalBinary(b []byte) error {
	ck2, err := CursorKeyFromBytes(b)
	if err != nil {
		return err
	}

	*ck = ck2

	return nil
}
