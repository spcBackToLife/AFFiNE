package models

import "time"

type Workspace struct {
	ID                 string    `json:"id" orm:"pk;type(varchar);column(id)"`
	SID                int       `json:"-" orm:"unique;auto;column(sid)"` // Serial in DB
	Public             bool      `json:"public"`
	Name               *string   `json:"name,omitempty" orm:"null;type(varchar)"`
	AvatarKey          *string   `json:"avatarKey,omitempty" orm:"null;column(avatar_key);type(varchar)"`
	EnableAI           bool      `json:"enableAi" orm:"default(true);column(enable_ai)"`
	EnableURLPreview   bool      `json:"enableUrlPreview" orm:"default(false);column(enable_url_preview)"`
	EnableDocEmbedding bool      `json:"enableDocEmbedding" orm:"default(true);column(enable_doc_embedding)"`
	Indexed            bool      `json:"indexed" orm:"default(false)"`
	CreatedAt          time.Time `json:"createdAt" orm:"auto_now_add;column(created_at);type(timestamp with time zone)"`
}

// WorkspaceMemberRole corresponds to WorkspaceUserRole in Prisma (workspace_user_permissions table)
type WorkspaceMemberRole struct {
	ID          string    `json:"id" orm:"pk;type(varchar)"`
	WorkspaceID string    `json:"workspaceId" orm:"column(workspace_id);type(varchar)"`
	UserID      string    `json:"userId" orm:"column(user_id);type(varchar)"`
	RoleType    int       `json:"roleType" orm:"column(type);type(smallint)"` // e.g., Owner, Admin (maps to Int in Prisma)
	Status      string    `json:"status" orm:"type(varchar)"`                // Maps to WorkspaceMemberStatus enum
	Source      string    `json:"source" orm:"type(varchar)"`                // Maps to WorkspaceMemberSource enum
	InviterID   *string   `json:"inviterId,omitempty" orm:"null;column(inviter_id);type(varchar)"`
	Accepted    bool      `json:"accepted" orm:"default(false)"` // Deprecated in Prisma, but present
	CreatedAt   time.Time `json:"createdAt" orm:"auto_now_add;column(created_at);type(timestamp with time zone)"`
	UpdatedAt   time.Time `json:"updatedAt" orm:"auto_now;column(updated_at);type(timestamp with time zone)"`
}
