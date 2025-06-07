package models

import "time"

// Snapshot (snapshots table)
// Prisma: @@id([workspaceId, id]), where id is 'guid' in DB
type Snapshot struct {
	// No single PK tag here due to composite key. See notes in doc.go
	WorkspaceID string    `json:"workspaceId" orm:"column(workspace_id);type(varchar)"`
	ID          string    `json:"id" orm:"column(guid);type(varchar)"` // Mapped to 'guid' which is part of composite PK
	Blob        []byte    `json:"-" orm:"type(bytea)"`
	State       []byte    `json:"-" orm:"null;type(bytea)"`
	CreatedAt   time.Time `json:"createdAt" orm:"auto_now_add;column(created_at);type(timestamp with time zone)"`
	UpdatedAt   time.Time `json:"updatedAt" orm:"column(updated_at);type(timestamp with time zone)"` // Not auto_now in Prisma schema for this table
	CreatedBy   *string   `json:"createdBy,omitempty" orm:"null;column(created_by);type(varchar)"`
	UpdatedBy   *string   `json:"updatedBy,omitempty" orm:"null;column(updated_by);type(varchar)"`
}

// UserSnapshot (user_snapshots table)
// Prisma: @@id([userId, id])
type UserSnapshot struct {
	// No single PK tag here due to composite key.
	UserID    string    `json:"userId" orm:"column(user_id);type(varchar)"`
	ID        string    `json:"id" orm:"column(id);type(varchar)"`
	Blob      []byte    `json:"-" orm:"type(bytea)"`
	CreatedAt time.Time `json:"createdAt" orm:"auto_now_add;column(created_at);type(timestamp with time zone)"`
	UpdatedAt time.Time `json:"updatedAt" orm:"auto_now;column(updated_at);type(timestamp with time zone)"` // Has @updatedAt in Prisma
}
