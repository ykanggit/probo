package coredata

import "time"

type (
	Control struct {
		ID          string
		FrameworkID string
		ContentID   string
		CreatedAt   time.Time
		UpdatedAt   time.Time
	}
)
