package page

import (
	"encoding/base64"
	"encoding/binary"
	"errors"
	"time"

	"go.gearno.de/crypto/uuid"
)

type (
	CursorKey [byteLength]byte
)

var (
	CursorKeyNil CursorKey

	ErrInvalidFormat = errors.New("invalid format")
)

const (
	byteLength = 28
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

func NewCursorKey(id uuid.UUID, t time.Time) CursorKey {
	var cursorKey CursorKey
	copy(cursorKey[:20], id[:])
	_ = binary.PutVarint(cursorKey[20:], t.UnixMicro())

	return cursorKey
}

func (ck CursorKey) Bytes() []byte {
	return ck[:]
}

func (ck CursorKey) String() string {
	return base64.RawURLEncoding.EncodeToString(ck.Bytes())
}

func (ck CursorKey) Timestamp() time.Time {
	return ck.ID().Timestamp()
}

func (ck CursorKey) ID() uuid.UUID {
	id, _ := uuid.FromBytes(ck[:])
	return id
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
