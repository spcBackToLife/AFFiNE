package models

import "time"

type User struct {
	ID              string     `json:"id" orm:"pk;type(varchar);column(id)"`
	Name            string     `json:"name" orm:"type(varchar)"`
	Email           string     `json:"email" orm:"unique;type(varchar)"`
	EmailVerifiedAt *time.Time `json:"emailVerifiedAt,omitempty" orm:"null;column(email_verified);type(timestamp with time zone)"`
	AvatarURL       *string    `json:"avatarUrl,omitempty" orm:"null;column(avatar_url);type(varchar)"`
	PasswordHash    string     `json:"-" orm:"column(password);type(varchar);null"`
	Registered      bool       `json:"registered" orm:"default(true)"`
	Disabled        bool       `json:"disabled" orm:"default(false)"`
	CreatedAt       time.Time  `json:"createdAt" orm:"auto_now_add;column(created_at);type(timestamp with time zone)"`
}

// UserSettings (user_settings table)
type UserSettings struct {
	UserID    string    `json:"userId" orm:"pk;column(user_id);type(varchar)"`
	Payload   string    `json:"payload" orm:"type(jsonb)"` // Prisma: JsonB
	CreatedAt time.Time `json:"createdAt" orm:"auto_now_add;column(created_at);type(timestamp with time zone)"`
	UpdatedAt time.Time `json:"updatedAt" orm:"auto_now;column(updated_at);type(timestamp with time zone)"`
}
