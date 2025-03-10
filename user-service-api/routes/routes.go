package routes

import (
	"project/shared/jwt"
	"project/user-service-api/controllers"
	repository "project/user-service-api/repository/impl"
	service "project/user-service-api/services/impl"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(route *gin.Engine, db *gorm.DB) {
	userRepo := repository.NewUserRepository(db)
	roleRepo := repository.NewRoleRepository(db)
	permissionRepo := repository.NewPermissionRepository(db)
	loginRepo := repository.NewLoginRepository(db)
	spRepo := repository.NewShippingDetailsRepository(db)

	userService := service.NewUserService(userRepo)
	roleService := service.NewRoleService(roleRepo)
	permissionService := service.NewPermissionService(permissionRepo)
	loginService := service.NewLoginService(loginRepo)
	spService := service.NewShippingDetailService(spRepo)

	user := controllers.NewUserController(userService)
	role := controllers.NewRoleController(roleService)
	permission := controllers.NewPermissionController(permissionService)
	loginController := controllers.NewLoginController(loginService)
	spController := controllers.NewShippingDetailController(spService)

	// Users API
	spGroup := route.Group("/api/shipping-detail")
	{
		spGroup.POST("/", spController.CreateShippingDetail)
		spGroup.GET("/:id", spController.GetShippingDetail)
		spGroup.GET("/", spController.GetAllShippingDetails)
		spGroup.PUT("/:id", spController.UpdateShippingDetail)
		spGroup.DELETE("/:id", spController.DeleteShippingDetail)
	}

	// ✅ Authentication Routes (Public)
	authGroup := route.Group("/api")
	{
		authGroup.POST("/users", user.CreateUser)
		authGroup.POST("/login", loginController.UserLogin)
		authGroup.GET("/me", loginController.Me)
		authGroup.POST("/logout", loginController.Logout)
	}

	// ✅ Protected Routes (Require JWT)
	protectedRoutes := route.Group("/api")
	protectedRoutes.Use(jwt.AuthMiddleware())

	// Users API
	userGroup := protectedRoutes.Group("/users")
	{
		// userGroup.POST("/", user.CreateUser)
		userGroup.GET("/:id", user.GetUser)
		userGroup.GET("/", user.GetAllUsers)
		userGroup.PUT("/:id", user.UpdateUser)
		userGroup.DELETE("/:id", user.DeleteUser)
	}

	// Roles API
	roleGroup := protectedRoutes.Group("/roles")
	{
		roleGroup.POST("/", role.CreateRole)
		roleGroup.GET("/:id", role.GetRole)
		roleGroup.GET("/", role.GetAllRoles)
		roleGroup.PUT("/:id", role.UpdateRole)
		roleGroup.DELETE("/:id", role.DeleteRole)
	}

	// Permissions API
	permissionGroup := protectedRoutes.Group("/permissions")
	{
		permissionGroup.POST("/", permission.CreatePermission)
		permissionGroup.GET("/", permission.GetAllPermissions)
	}
}
