package coredata

import "time"

type (
	Evidence struct {
		ID        string
		TaskID    string
		ContentID string
		CreatedAt time.Time
		UpdatedAt time.Time
	}
)
