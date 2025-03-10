package gid

import (
	"crypto/rand"
	"database/sql/driver"
	"encoding/base64"
	"encoding/binary"
	"fmt"
	"time"
)

const (
	GIDSize = 32 // 256 bits total
)

type (
	GID      [GIDSize]byte
	TenantID [16]byte // 128-bit tenant ID
)

var (
	Nil = GID{}
)

// ParseGID parses a string representation of a GID
func ParseGID(encoded string) (GID, error) {
	gid := GID{}
	err := gid.UnmarshalText([]byte(encoded))
	if err != nil {
		return Nil, err
	}
	return gid, nil
}

// New creates a new GID with default entity type and nil tenant ID
func New(tenantID TenantID, entityType uint16) GID {
	id, err := NewGID(tenantID, entityType)
	if err != nil {
		// This should never happen with a valid random source
		panic(fmt.Sprintf("failed to generate GID: %v", err))
	}
	return id
}

// NewGID creates a new GID with the specified entity type and tenant ID
// Structure:
// - Bytes 0-15: Tenant ID (full 16 bytes)
// - Bytes 16-17: Entity Type (uint16)
// - Bytes 18-25: Timestamp (milliseconds since epoch)
// - Bytes 26-31: Random data for uniqueness
func NewGID(tenantID TenantID, entityType uint16) (GID, error) {
	var id GID

	// Write full tenant ID (16 bytes)
	copy(id[0:16], tenantID[:])

	// Write entity type (2 bytes)
	binary.BigEndian.PutUint16(id[16:18], entityType)

	// Get current timestamp (milliseconds) and write it (8 bytes)
	now := time.Now().UnixMilli()
	binary.BigEndian.PutUint64(id[18:26], uint64(now))

	// Fill the rest with random data (6 bytes)
	_, err := rand.Read(id[26:32])
	if err != nil {
		return Nil, fmt.Errorf("failed to generate random bytes: %v", err)
	}

	return id, nil
}

// Value implements the database/sql/driver.Valuer interface
func (gid GID) Value() (driver.Value, error) {
	return gid.String(), nil
}

// TenantID extracts the tenant ID from the GID
func (gid GID) TenantID() TenantID {
	var tenantID TenantID
	copy(tenantID[:], gid[0:16])
	return tenantID
}

// EntityType extracts the entity type from the GID
func (gid GID) EntityType() uint16 {
	return binary.BigEndian.Uint16(gid[16:18])
}

// Timestamp extracts the timestamp from the GID
func (gid GID) Timestamp() time.Time {
	millis := binary.BigEndian.Uint64(gid[18:26])
	return time.UnixMilli(int64(millis))
}

// Scan implements the database/sql/driver.Scanner interface
func (gid *GID) Scan(value interface{}) error {
	switch v := value.(type) {
	case string:
		enc := base64.RawURLEncoding
		id, err := enc.DecodeString(v)
		if err != nil {
			return err
		}

		if len(id) != GIDSize {
			return fmt.Errorf("invalid length for GID: got %d, want %d", len(id), GIDSize)
		}

		copy((*gid)[:], id)
	default:
		return fmt.Errorf("invalid type for GID: expected string, got %T", value)
	}
	return nil
}

// String returns the base64url encoded representation of the GID
func (gid GID) String() string {
	return base64.RawURLEncoding.EncodeToString(gid[:])
}

// MarshalText returns the base64url encoded representation of the GID
func (gid GID) MarshalText() ([]byte, error) {
	enc := base64.RawURLEncoding
	buf := make([]byte, enc.EncodedLen(len(gid)))
	enc.Encode(buf, gid[:])
	return buf, nil
}

// UnmarshalText decodes a base64url encoded GID
func (gid *GID) UnmarshalText(encoded []byte) error {
	enc := base64.RawURLEncoding
	dst := make([]byte, enc.DecodedLen(len(encoded)))
	n, err := enc.Decode(dst, encoded)
	if err != nil {
		return err
	}

	if n != GIDSize {
		return fmt.Errorf("invalid length for GID: got %d, want %d", n, GIDSize)
	}

	copy((*gid)[:], dst)
	return nil
}
