// packages/backend/server-go/routers/router.go
package routers

import (
	"app/server-go/controllers" // Corrected module path based on go.mod
	"app/server-go/middleware"  // Import middleware
	beego "github.com/beego/beego/v2/server/web"
)

func init() {
	authNamespace := beego.NewNamespace("/v1/auth",
		beego.NSCtrl(&controllers.AuthController{}),
		beego.NSRouter("/signup", &controllers.AuthController{}, "post:SignUp"),
		beego.NSRouter("/signin", &controllers.AuthController{}, "post:SignIn"),
		beego.NSRouter("/signout", &controllers.AuthController{}, "post:SignOut"),
	)
	beego.AddNamespace(authNamespace)

	// Sample Protected Namespace
	protectedNamespace := beego.NewNamespace("/v1/protected",
		beego.NSBefore(middleware.Authenticate), // Apply middleware.Authenticate
		beego.NSRouter("/me", &controllers.UserController{}, "get:GetMe"),
	)
	beego.AddNamespace(protectedNamespace)

	// Workspace Namespace
	workspaceNamespace := beego.NewNamespace("/v1/workspaces",
		beego.NSBefore(middleware.Authenticate), // Apply middleware.Authenticate
		beego.NSCtrl(&controllers.WorkspaceController{}),
		beego.NSRouter("/", &controllers.WorkspaceController{}, "post:CreateWorkspace;get:GetAllWorkspaces"),
		beego.NSRouter("/:workspaceId", &controllers.WorkspaceController{}, "get:GetWorkspaceByID;put:UpdateWorkspace;delete:DeleteWorkspace"),
	)
	beego.AddNamespace(workspaceNamespace)

	// Admin Namespaces
	adminCopilotNamespace := beego.NewNamespace("/v1/admin/copilot-prompts",
		beego.NSBefore(middleware.Authenticate),
		beego.NSCtrl(&controllers.AdminCopilotController{}),
		beego.NSRouter("/", &controllers.AdminCopilotController{}, "get:ListPrompts"), // Corresponds to copilot_prompts
		beego.NSRouter("/:promptName", &controllers.AdminCopilotController{}, "put:UpdatePrompt"), // Corresponds to update_copilot_prompt (assuming promptName in path)
	)
	beego.AddNamespace(adminCopilotNamespace)

	adminConfigNamespace := beego.NewNamespace("/v1/admin", // Base path for app-config for simpler mapping
		beego.NSBefore(middleware.Authenticate),
		beego.NSCtrl(&controllers.AdminConfigController{}),
		beego.NSRouter("/app-config", &controllers.AdminConfigController{}, "get:GetAppConfig;put:UpdateAppConfig"), // Corresponds to app_config and update_app_config
		// beego.NSRouter("/app-config/validate", &controllers.AdminConfigController{}, "post:ValidateAppConfig"), // No direct GQL mapping yet
	)
	beego.AddNamespace(adminConfigNamespace)

	adminMailerNamespace := beego.NewNamespace("/v1/admin/mailer",
		beego.NSBefore(middleware.Authenticate),
		beego.NSCtrl(&controllers.AdminMailerController{}),
		beego.NSRouter("/send-test", &controllers.AdminMailerController{}, "post:SendTestEmail"), // Corresponds to admin_send_test_email
	)
	beego.AddNamespace(adminMailerNamespace)

	adminUserNamespace := beego.NewNamespace("/v1/admin/users",
		beego.NSBefore(middleware.Authenticate),
		beego.NSCtrl(&controllers.AdminUserController{}),
		beego.NSRouter("/", &controllers.AdminUserController{}, "get:ListUsers;post:CreateUser"), // Corresponds to admin_users_list (GET) and admin_users_create (POST)
		beego.NSRouter("/:userId", &controllers.AdminUserController{}, "get:GetUserById;put:UpdateUser;delete:DeleteUser"), // GetUserById not mapped from GQL yet directly. admin_users_update, admin_users_delete
		beego.NSRouter("/:userId/features", &controllers.AdminUserController{}, "put:UpdateUserFeatures"),           // Corresponds to admin_users_update_features
		beego.NSRouter("/:userId/change-password-url", &controllers.AdminUserController{}, "post:CreateChangePasswordUrl"), // Corresponds to admin_users_create_change_password_url
		beego.NSRouter("/:userId/enable", &controllers.AdminUserController{}, "post:EnableUser"),                   // Corresponds to admin_users_enable
		beego.NSRouter("/:userId/disable", &controllers.AdminUserController{}, "post:DisableUser"),                 // Corresponds to admin_users_disable
		beego.NSRouter("/import", &controllers.AdminUserController{}, "post:ImportUsers"),                         // Corresponds to admin_users_import
		beego.NSRouter("/get-by-email", &controllers.AdminUserController{}, "post:GetUserByEmail"), // Corresponds to admin_users_get_by_email (assuming POST for consistency if it takes email in body)
	)
	beego.AddNamespace(adminUserNamespace)
}
