// packages/backend/server-go/middleware/auth.go
package middleware

import (
	"strings"
	"fmt"

	"github.com/beego/beego/v2/server/web/context"
	"github.com/supabase-community/gotrue-go"
	"app/server-go/services"
)

// Authenticate is a Beego FilterFunc to verify Supabase JWT tokens.
func Authenticate(ctx *context.Context) {
	authHeader := ctx.Input.Header("Authorization")
	if authHeader == "" {
		ctx.Output.SetStatus(401)
		// It's good practice to ensure JSONResp is called only once or to use specific error handling functions.
		// Beego's Ctx.Abort can also be used in filters.
		_ = ctx.JSONResp(map[string]string{"error": "Missing Authorization header"})
		return
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
		ctx.Output.SetStatus(401)
		_ = ctx.JSONResp(map[string]string{"error": "Malformed Authorization header. Expected: Bearer <token>"})
		return
	}
	accessToken := parts[1]

	client, err := services.GetSupabaseAuthClient()
	if err != nil {
		ctx.Output.SetStatus(500)
		_ = ctx.JSONResp(map[string]string{"error": "Failed to initialize Supabase client: " + err.Error()})
		return
	}
    if client == nil {
		ctx.Output.SetStatus(500)
		_ = ctx.JSONResp(map[string]string{"error": "Supabase client is nil after initialization attempt"})
		return
    }


	user, err := client.GetUser(accessToken)
	if err != nil {
        errMsg := "Invalid or expired token"
        if e, ok := err.(*gotrue.Error); ok {
            errMsg = fmt.Sprintf("%s: %s (Code: %d)", errMsg, e.Message, e.Code)
        } else {
            errMsg = fmt.Sprintf("%s: %s", errMsg, err.Error())
        }
		ctx.Output.SetStatus(401)
		_ = ctx.JSONResp(map[string]string{"error": errMsg})
		return
	}

	// Token is valid, user is retrieved.
	// Store user information in context for downstream handlers.
	ctx.Input.SetData("user", user)       // Full user object
	ctx.Input.SetData("userID", user.ID) // Just the ID for convenience

	// If you need to check specific roles or permissions, you could do it here or in another filter.
	// For example: if user.Role != "authenticated" { ... }
}
