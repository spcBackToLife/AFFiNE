package models

import "time"

// Doc corresponds to WorkspaceDoc in Prisma (workspace_pages table)
// Note: Prisma model has @@id([workspaceId, docId]), Beego ORM's default behavior prefers a single PK.
// If using composite PKs, it needs explicit setup or model tags.
// For now, defining fields. A common pattern is to add a surrogate `Id int orm:"auto;pk"` if composite keys are complex to manage.
// Or, ensure your ORM queries use both fields in WHERE clauses for uniqueness.
type Doc struct {
	// ID    int     `orm:"auto;pk"` // Example of a surrogate key if needed
	WorkspaceID string  `json:"workspaceId" orm:"column(workspace_id);type(varchar)"` // Part of composite PK in DB
	DocID       string  `json:"docId" orm:"column(page_id);type(varchar)"`         // Part of composite PK in DB
	Public      bool    `json:"public" orm:"default(false)"`
	DefaultRole int     `json:"defaultRole" orm:"column(defaultRole);default(30);type(smallint)"` // Prisma: defaultRole
	Mode        int     `json:"mode" orm:"default(0);type(smallint)"`
	Blocked     bool    `json:"blocked" orm:"default(false)"`
	Title       *string `json:"title,omitempty" orm:"null;type(varchar)"`
	Summary     *string `json:"summary,omitempty" orm:"null;type(varchar)"`
}
// In Beego ORM, for composite primary keys, you might need to define them in the init function of models
// or use RunSyncdb with verbose output to see how it interprets them. Often, operations like Read() might need manual WHERE conditions for all parts of a composite key if a single PK is not defined with `orm:"pk"`.
// For simplicity in this auto-generation, I'm not adding orm:"pk" to WorkspaceID or DocID for this struct yet.

// DocPermission corresponds to WorkspaceDocUserRole in Prisma (workspace_page_user_permissions table)
// Prisma model has @@id([workspaceId, docId, userId])
type DocPermission struct {
	// ID    int     `orm:"auto;pk"` // Example of a surrogate key
	WorkspaceID string    `json:"workspaceId" orm:"column(workspace_id);type(varchar)"` // Part of composite PK
	DocID       string    `json:"docId" orm:"column(page_id);type(varchar)"`         // Part of composite PK
	UserID      string    `json:"userId" orm:"column(user_id);type(varchar)"`         // Part of composite PK
	RoleType    int       `json:"roleType" orm:"column(type);type(smallint)"`         // e.g., Editor, Reader
	CreatedAt   time.Time `json:"createdAt" orm:"auto_now_add;column(created_at);type(timestamp with time zone)"`
}
