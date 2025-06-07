package models
import "time"

// AiPrompt (ai_prompts_metadata table)
type AiPrompt struct {
	ID             int        `json:"id" orm:"auto;pk;column(id)"` // Explicitly column(id) as Prisma maps it this way for autoincrement
	Name           string     `json:"name" orm:"unique;size(32);type(varchar)"`
	Action         *string    `json:"action,omitempty" orm:"null;type(varchar)"`
	Model          string     `json:"model" orm:"type(varchar)"`
	OptionalModels string     `json:"optionalModels,omitempty" orm:"column(optional_models);type(text)"` // Store as comma-separated or JSON string for String[]
	Config         *string    `json:"config,omitempty" orm:"null;type(jsonb)"` // Prisma: Json, so jsonb is appropriate
	CreatedAt      time.Time  `json:"createdAt" orm:"auto_now_add;column(created_at);type(timestamp with time zone)"`
	UpdatedAt      time.Time  `json:"updatedAt" orm:"auto_now;column(updated_at);type(timestamp with time zone)"` // Prisma: @default(now()) @updatedAt
	Modified       bool       `json:"modified" orm:"default(false)"`
}

// AiPromptMessage (ai_prompts_messages table)
// Prisma: @@unique([promptId, idx]) - This implies these two form a key, not necessarily a formal PK if not stated as @@id
// For Beego, if no orm:"pk" is defined, it won't assume a PK for operations like Read().
// Consider adding a surrogate key or handling carefully.
type AiPromptMessage struct {
	// ID        int       `orm:"auto;pk"` // Optional surrogate key
	PromptID    int       `json:"promptId" orm:"column(prompt_id)"` // Part of unique constraint
	Idx         int       `json:"idx"`                              // Part of unique constraint
	Role        string    `json:"role" orm:"type(varchar)"`         // Maps to AiPromptRole enum
	Content     string    `json:"content" orm:"type(text)"`
	Attachments *string   `json:"attachments,omitempty" orm:"null;type(jsonb)"` // Prisma: Json
	Params      *string   `json:"params,omitempty" orm:"null;type(jsonb)"`      // Prisma: Json
	CreatedAt   time.Time `json:"createdAt" orm:"auto_now_add;column(created_at);type(timestamp with time zone)"`
}

// AiSession (ai_sessions_metadata table)
type AiSession struct {
	ID              string     `json:"id" orm:"pk;type(varchar)"`
	UserID          string     `json:"userId" orm:"column(user_id);type(varchar)"`
	WorkspaceID     string     `json:"workspaceId" orm:"column(workspace_id);type(varchar)"`
	DocID           string     `json:"docId" orm:"column(doc_id);type(varchar)"`
	PromptName      string     `json:"promptName" orm:"column(prompt_name);size(32);type(varchar)"`
	ParentSessionID *string    `json:"parentSessionId,omitempty" orm:"null;column(parent_session_id);type(varchar)"`
	MessageCost     int        `json:"messageCost" orm:"default(0);column(messageCost)"` // Prisma maps to messageCost
	TokenCost       int        `json:"tokenCost" orm:"default(0);column(tokenCost)"`     // Prisma maps to tokenCost
	CreatedAt       time.Time  `json:"createdAt" orm:"auto_now_add;column(created_at);type(timestamp with time zone)"`
	DeletedAt       *time.Time `json:"deletedAt,omitempty" orm:"null;column(deleted_at);type(timestamp with time zone)"`
}
