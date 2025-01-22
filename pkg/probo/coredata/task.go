package coredata

import "time"

type (
	Task struct {
		ID        string
		ContentID string
		CreatedAt time.Time
		UpdatedAt time.Time
	}
)
