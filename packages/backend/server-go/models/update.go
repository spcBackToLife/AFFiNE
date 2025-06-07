package models

import "time"

// Update (updates table)
// Prisma: @@id([workspaceId, id, createdAt]), where id is 'guid' in DB
type Update struct {
	// No single PK tag here due to composite key.
	WorkspaceID string    `json:"workspaceId" orm:"column(workspace_id);type(varchar)"`
	ID          string    `json:"id" orm:"column(guid);type(varchar)"` // Mapped to 'guid'
	Blob        []byte    `json:"-" orm:"type(bytea)"`
	CreatedAt   time.Time `json:"createdAt" orm:"column(created_at);type(timestamp with time zone)"` // Part of composite PK, not auto_now_add from Prisma
	CreatedBy   *string   `json:"createdBy,omitempty" orm:"null;column(created_by);type(varchar)"`
}
