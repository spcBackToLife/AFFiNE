// packages/backend/server-go/controllers/user_controller.go
package controllers

import (
	beego "github.com/beego/beego/v2/server/web"
	"github.com/supabase-community/gotrue-go" // For gotrue.User type assertion
)

type UserController struct {
	beego.Controller
}

// @Title GetMe
// @Description Get current user's details (protected route)
// @Success 200 {object} map[string]interface{} "Current user details"
// @Failure 401 {object} map[string]string "Unauthorized - User not found in context (should be caught by middleware)"
// @Failure 500 {object} map[string]string "Internal server error - User data in context is not of expected type"
// @router /me [get]
func (c *UserController) GetMe() {
	userData := c.Ctx.Input.GetData("user")
	if userData == nil {
		c.Ctx.Output.SetStatus(401)
		c.Data["json"] = map[string]string{"error": "Unauthorized: No user data in context. Access via middleware?"}
		c.ServeJSON()
		return
	}

	user, ok := userData.(*gotrue.User) // Type assertion
	if !ok {
		c.Ctx.Output.SetStatus(500)
		c.Data["json"] = map[string]string{"error": "Internal server error: User data in context is not of expected type."}
		c.ServeJSON()
		return
	}

	c.Data["json"] = map[string]interface{}{
		"message": "Successfully retrieved user details.",
		"user": map[string]interface{}{
			"id":             user.ID,
			"email":          user.Email,
			"created_at":     user.CreatedAt,
			"confirmed_at":   user.ConfirmedAt,
			"last_sign_in_at": user.LastSignInAt,
			"role":           user.Role,
			"app_metadata":   user.AppMetadata,
			"user_metadata":  user.UserMetadata,
		},
	}
	c.ServeJSON()
}
