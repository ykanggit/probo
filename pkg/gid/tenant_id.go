package gid

import (
	"crypto/rand"
	"database/sql/driver"
	"encoding/base64"
	"encoding/binary"
	"fmt"
	"os"
	"sync/atomic"
	"time"
)

var (
	// NilTenant represents an empty tenant ID
	NilTenant = TenantID{}

	// Global generation singleton
	defaultTenantGenerator = newTenantGenerator()
)

// TenantGenerator handles creation of unique tenant IDs
type tenantGenerator struct {
	// Process-specific values
	machineID [6]byte // 48 bits for machine identifier
	processID uint16  // 16 bits for process
	counter   uint32  // Counter for the sequence
}

// NewTenantID generates a new globally unique tenant ID
func NewTenantID() TenantID {
	return defaultTenantGenerator.NewTenantID()
}

// ParseTenantID parses a string representation into a TenantID
func ParseTenantID(s string) (TenantID, error) {
	var id TenantID
	decoded, err := base64.RawURLEncoding.DecodeString(s)
	if err != nil {
		return NilTenant, fmt.Errorf("invalid tenant ID encoding: %w", err)
	}

	if len(decoded) != len(id) {
		return NilTenant, fmt.Errorf("invalid tenant ID length: got %d, want %d", len(decoded), len(id))
	}

	copy(id[:], decoded)
	return id, nil
}

// newTenantGenerator creates a new generator with machine-specific components
func newTenantGenerator() *tenantGenerator {
	g := &tenantGenerator{
		counter: 0,
	}

	// Generate machine ID component
	if _, err := rand.Read(g.machineID[:]); err != nil {
		// Fallback if random source fails
		hostname, _ := os.Hostname()
		copy(g.machineID[:], []byte(hostname))

		// Pad with timestamp bits if hostname is short
		if len(hostname) < len(g.machineID) {
			ts := time.Now().UnixNano()
			binary.BigEndian.PutUint32(g.machineID[len(hostname):], uint32(ts))
		}
	}

	// Set process ID from OS PID
	g.processID = uint16(os.Getpid() & 0xFFFF)

	return g
}

// NewTenantID generates a new 128-bit tenant ID with the structure:
// - 48 bits: Machine ID (random, unique per machine)
// - 16 bits: Process ID (unique per process on machine)
// - 48 bits: Timestamp (milliseconds, sequential)
// - 16 bits: Counter (increments per ID)
func (g *tenantGenerator) NewTenantID() TenantID {
	// Create new ID
	var id TenantID

	// 1. Get timestamp (48 bits = milliseconds since epoch)
	now := time.Now().UnixMilli()

	// 2. Increment counter atomically (16 bits used)
	count := atomic.AddUint32(&g.counter, 1) & 0xFFFF

	// 3. Assemble the ID
	// First 6 bytes: Machine ID
	copy(id[0:6], g.machineID[:])

	// Next 2 bytes: Process ID
	binary.BigEndian.PutUint16(id[6:8], g.processID)

	// Next 6 bytes: Timestamp (48 bits)
	id[8] = byte(now >> 40)
	id[9] = byte(now >> 32)
	id[10] = byte(now >> 24)
	id[11] = byte(now >> 16)
	id[12] = byte(now >> 8)
	id[13] = byte(now)

	// Last 2 bytes: Counter
	binary.BigEndian.PutUint16(id[14:16], uint16(count))

	return id
}

// Value implements the database/sql/driver.Valuer interface
func (id TenantID) Value() (driver.Value, error) {
	return id.String(), nil
}

// Scan implements the database/sql.Scanner interface
func (id *TenantID) Scan(value interface{}) error {
	switch v := value.(type) {
	case string:
		decoded, err := base64.RawURLEncoding.DecodeString(v)
		if err != nil {
			return err
		}

		if len(decoded) != len(*id) {
			return fmt.Errorf("invalid tenant ID length: got %d, want %d", len(decoded), len(*id))
		}

		copy((*id)[:], decoded)
		return nil
	default:
		return fmt.Errorf("invalid type for TenantID: expected string, got %T", value)
	}
}

// String returns the base64 representation of the TenantID
func (id TenantID) String() string {
	return base64.RawURLEncoding.EncodeToString(id[:])
}

// MarshalText returns the base64 representation for JSON encoding
func (id TenantID) MarshalText() ([]byte, error) {
	encoded := base64.RawURLEncoding.EncodeToString(id[:])
	return []byte(encoded), nil
}

// UnmarshalText parses the base64 representation for JSON decoding
func (id *TenantID) UnmarshalText(text []byte) error {
	decoded, err := base64.RawURLEncoding.DecodeString(string(text))
	if err != nil {
		return err
	}

	if len(decoded) != len(*id) {
		return fmt.Errorf("invalid tenant ID length: got %d, want %d", len(decoded), len(*id))
	}

	copy((*id)[:], decoded)
	return nil
}

// IsValid returns true if the tenant ID is not nil
func (id TenantID) IsValid() bool {
	return id != NilTenant
}

// Timestamp extracts the timestamp from the TenantID
func (id TenantID) Timestamp() time.Time {
	millis := int64(id[8])<<40 | int64(id[9])<<32 | int64(id[10])<<24 |
		int64(id[11])<<16 | int64(id[12])<<8 | int64(id[13])
	return time.UnixMilli(millis)
}
