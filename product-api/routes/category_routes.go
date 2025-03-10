package routes

import (
	"project/product-api/controllers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	repository "project/product-api/repository/impl"
	services "project/product-api/services/impl"
)

func CategoryRoutes(r *gin.Engine, db *gorm.DB) {

	catRepo := repository.NewCategoryRepository(db)
	catService := services.NewCategoryService(catRepo)

	Controller := controllers.NewCategoryController(catService)
	userGroup := r.Group("/api/categories")
	{
		userGroup.POST("/", Controller.CreateCategory)
		userGroup.GET("/:id", Controller.GetCategory)
		userGroup.GET("/", Controller.GetAllCategories)
		userGroup.PUT("/:id", Controller.UpdateCategory)
		userGroup.DELETE("/:id", Controller.DeleteCategory)
		userGroup.GET("/list", Controller.GetAllCategoriesList)

	}
}
