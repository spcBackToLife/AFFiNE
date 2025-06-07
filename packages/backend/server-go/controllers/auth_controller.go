// packages/backend/server-go/controllers/auth_controller.go
package controllers

import (
	"encoding/json"
	"fmt"

	beego "github.com/beego/beego/v2/server/web"
	"github.com/supabase-community/gotrue-go"
	"app/server-go/services"
	"github.com/beego/beego/v2/server/web" // Added for AppConfig in SignIn
	"strings" // Required for Bearer token processing
)

type AuthController struct {
	beego.Controller
}

type SignUpPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type SignInPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// @Title SignUp
// @Description Register a new user
// @Param	body		body 	SignUpPayload	true		"body for user signup"
// @Success 201 {object} map[string]interface{} "User created (may require email confirmation)"
// @Failure 400 {object} map[string]string "Invalid input"
// @Failure 500 {object} map[string]string "Error creating user or initializing client"
// @router /signup [post]
func (c *AuthController) SignUp() {
	var payload SignUpPayload
	if err := json.Unmarshal(c.Ctx.Input.RequestBody, &payload); err != nil {
		c.Ctx.Output.SetStatus(400)
		c.Data["json"] = map[string]string{"error": "Invalid request payload: " + err.Error()}
		c.ServeJSON()
		return
	}

	if payload.Email == "" || payload.Password == "" {
		c.Ctx.Output.SetStatus(400)
		c.Data["json"] = map[string]string{"error": "Email and password are required."}
		c.ServeJSON()
		return
	}

	client, err := services.GetSupabaseAuthClient()
	if err != nil {
		c.Ctx.Output.SetStatus(500)
		c.Data["json"] = map[string]string{"error": "Failed to initialize Supabase client: " + err.Error()}
		c.ServeJSON()
		return
	}
    if client == nil {
        c.Ctx.Output.SetStatus(500)
        c.Data["json"] = map[string]string{"error": "Supabase client is nil after initialization attempt"}
        c.ServeJSON()
        return
    }


	user, signUpErr := client.SignUp(gotrue.UserCredentials{
		Email:    payload.Email,
		Password: payload.Password,
	})

	if signUpErr != nil {
		errMsg := "Error creating user"
		if e, ok := signUpErr.(*gotrue.Error); ok {
			 errMsg = fmt.Sprintf("%s: %s (Code: %d)", errMsg, e.Message, e.Code)
		} else {
			 errMsg = fmt.Sprintf("%s: %s", errMsg, signUpErr.Error())
		}
		c.Ctx.Output.SetStatus(500) // Consider 409 for conflict, 422 for validation if distinguishable
		c.Data["json"] = map[string]string{"error": errMsg}
		c.ServeJSON()
		return
	}

    response := map[string]interface{}{
        "message": "Signup successful. Please check your email for confirmation if required.",
        "userId": user.ID,
        "email": user.Email,
        "confirmationSentAt": user.ConfirmationSentAt,
        "isConfirmed": (user.ConfirmedAt != nil && !user.ConfirmedAt.IsZero()),
    }

    // Adjust message if user is confirmed (e.g. auto-confirm is on)
    // A user is typically confirmed if ConfirmedAt is set OR if Aud is "authenticated" (though Aud might not be immediately set post-signup without session)
    // For SignUp, ConfirmationSentAt is a key indicator. ConfirmedAt will be null until confirmed.
    if user.ConfirmedAt != nil && !user.ConfirmedAt.IsZero() {
         response["message"] = "Signup successful and user is confirmed."
    } else if user.ConfirmationSentAt != nil && !user.ConfirmationSentAt.IsZero() {
        response["message"] = "Signup successful. Confirmation email sent."
    }


	c.Ctx.Output.SetStatus(201)
	c.Data["json"] = response
	c.ServeJSON()
}

// @Title SignOut
// @Description Logs out a user by invalidating their current session token
// @Param	Authorization	header	string	true	"Bearer <access_token>"
// @Success 200 {object} map[string]string "Successfully signed out"
// @Failure 400 {object} map[string]string "Missing or malformed authorization token"
// @Failure 401 {object} map[string]string "Invalid or expired token"
// @Failure 500 {object} map[string]string "Internal server error"
// @router /signout [post]
func (c *AuthController) SignOut() {
	authHeader := c.Ctx.Input.Header("Authorization")
	if authHeader == "" {
		c.Ctx.Output.SetStatus(400)
		c.Data["json"] = map[string]string{"error": "Missing Authorization header"}
		c.ServeJSON()
		return
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
		c.Ctx.Output.SetStatus(400)
		c.Data["json"] = map[string]string{"error": "Malformed Authorization header. Expected: Bearer <token>"}
		c.ServeJSON()
		return
	}
	accessToken := parts[1]

	client, err := services.GetSupabaseAuthClient()
	if err != nil {
		c.Ctx.Output.SetStatus(500)
		c.Data["json"] = map[string]string{"error": "Failed to initialize Supabase client: " + err.Error()}
		c.ServeJSON()
		return
	}

	err = client.SignOut(accessToken)
	if err != nil {
		errMsg := "Error signing out"
		if e, ok := err.(*gotrue.Error); ok {
			errMsg = fmt.Sprintf("%s: %s (Code: %d)", errMsg, e.Message, e.Code)
			c.Ctx.Output.SetStatus(401)
		} else {
			errMsg = fmt.Sprintf("%s: %s", errMsg, err.Error())
			c.Ctx.Output.SetStatus(500)
		}
		c.Data["json"] = map[string]string{"error": errMsg}
		c.ServeJSON()
		return
	}

	c.Ctx.Output.SetStatus(200)
	c.Data["json"] = map[string]string{"message": "Successfully signed out"}
	c.ServeJSON()
}

// @Title SignIn
// @Description Logs in a user
// @Param	body		body 	SignInPayload	true		"body for user signin"
// @Success 200 {object} map[string]interface{} "Login successful, session returned"
// @Failure 400 {object} map[string]string "Invalid input or missing fields"
// @Failure 401 {object} map[string]string "Invalid credentials or user not confirmed"
// @Failure 500 {object} map[string]string "Internal server error"
// @router /signin [post]
func (c *AuthController) SignIn() {
	var payload SignInPayload
	if err := json.Unmarshal(c.Ctx.Input.RequestBody, &payload); err != nil {
		c.Ctx.Output.SetStatus(400)
		c.Data["json"] = map[string]string{"error": "Invalid request payload: " + err.Error()}
		c.ServeJSON()
		return
	}

	if payload.Email == "" || payload.Password == "" {
		c.Ctx.Output.SetStatus(400)
		c.Data["json"] = map[string]string{"error": "Email and password are required."}
		c.ServeJSON()
		return
	}

	client, err := services.GetSupabaseAuthClient()
	if err != nil {
		c.Ctx.Output.SetStatus(500)
		c.Data["json"] = map[string]string{"error": "Failed to initialize Supabase client: " + err.Error()}
		c.ServeJSON()
		return
	}
	if client == nil {
        c.Ctx.Output.SetStatus(500)
        c.Data["json"] = map[string]string{"error": "Supabase client is nil after initialization attempt"}
        c.ServeJSON()
        return
    }

	session, err := client.SignInWithEmailPassword(payload.Email, payload.Password)

	if err != nil {
		errMsg := "Error signing in"
		if e, ok := err.(*gotrue.Error); ok {
			errMsg = fmt.Sprintf("%s: %s (Code: %d)", errMsg, e.Message, e.Code)
			c.Ctx.Output.SetStatus(401) // Typically 401 for auth issues
		} else {
			errMsg = fmt.Sprintf("%s: %s", errMsg, err.Error())
			c.Ctx.Output.SetStatus(500)
		}
		c.Data["json"] = map[string]string{"error": errMsg}
		c.ServeJSON()
		return
	}

	// Check if email confirmation is required by application logic, though Supabase might enforce it.
	// This is an example if you had a specific app-level config for it.
	// Supabase's own "Confirm email" setting in Auth > Settings is the primary enforcer.
	// If that setting is ON, Supabase will return an error for unconfirmed users during SignInWithEmailPassword.
	// The 'session.User.ConfirmedAt' being nil/zero is the indicator.
	if session.User != nil && (session.User.ConfirmedAt == nil || session.User.ConfirmedAt.IsZero()) {
		// Check an example application-level config if needed
		requireEmailConfirmationAppLevel, _ := web.AppConfig.Bool("REQUIRE_EMAIL_CONFIRMATION_APP_LEVEL")
		if requireEmailConfirmationAppLevel {
			// This specific error might not be reachable if Supabase already blocked the login.
			c.Ctx.Output.SetStatus(401)
			c.Data["json"] = map[string]string{"error": "Application requires email confirmation. Please verify your email."}
			c.ServeJSON()
			return
		}
		// If Supabase allows login with unconfirmed email (setting is OFF),
		// and app doesn't explicitly block, then proceed.
	}


	c.Ctx.Output.SetStatus(200)
	c.Data["json"] = map[string]interface{}{
		"message":       "Login successful",
		"access_token":  session.AccessToken,
		"refresh_token": session.RefreshToken,
		"expires_at":    session.ExpiresAt,
		"token_type":    session.TokenType,
		"user": map[string]interface{}{
			"id":           session.User.ID,
			"email":        session.User.Email,
			"created_at":   session.User.CreatedAt,
			"confirmed_at": session.User.ConfirmedAt, // Can be nil/zero if not confirmed
		},
	}
	c.ServeJSON()
}
