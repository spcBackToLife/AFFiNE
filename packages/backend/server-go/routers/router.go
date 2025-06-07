// packages/backend/server-go/routers/router.go
package routers

import (
	beego "github.com/beego/beego/v2/server/web"
	"app/server-go/controllers" // Corrected module path based on go.mod
	"app/server-go/middleware"  // Import middleware
	// "github.com/beego/beego/v2/server/web/context" // Not strictly needed here for this change
)

func init() {
	authNamespace := beego.NewNamespace("/v1/auth",
		beego.NSCtrl(&controllers.AuthController{}),
		beego.NSRouter("/signup", &controllers.AuthController{}, "post:SignUp"),
		beego.NSRouter("/signin", &controllers.AuthController{}, "post:SignIn"),
		beego.NSRouter("/signout", &controllers.AuthController{}, "post:SignOut"),
	)
	beego.AddNamespace(authNamespace)

	// Sample Protected Namespace (existing, assuming UserController is defined)
	// If UserController is not yet defined, this might cause a compile error later,
	// but for now, we keep it as per previous state.
	protectedNamespace := beego.NewNamespace("/v1/protected",
		beego.NSBefore(middleware.Authenticate),
		beego.NSRouter("/me", &controllers.UserController{}, "get:GetMe"),
	)
	beego.AddNamespace(protectedNamespace)

	// Workspace Namespace
	// TODO: Apply middleware.Authenticate (beego.NSBefore(middleware.Authenticate)) to this namespace later
	workspaceNamespace := beego.NewNamespace("/v1/workspaces",
		beego.NSCtrl(&controllers.WorkspaceController{}), // Register controller for the namespace
		beego.NSRouter("/", &controllers.WorkspaceController{}, "post:CreateWorkspace;get:GetAllWorkspaces"),
		beego.NSRouter("/:workspaceId", &controllers.WorkspaceController{}, "get:GetWorkspaceByID;put:UpdateWorkspace;delete:DeleteWorkspace"),
	)
	beego.AddNamespace(workspaceNamespace)
}
