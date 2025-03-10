package routes

import (
	"project/product-api/controllers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	repository "project/product-api/repository/impl"
	services "project/product-api/services/impl"
)

func ProductRoutes(r *gin.Engine, db *gorm.DB) {

	proRepo := repository.NewProductRepository(db)
	proService := services.NewProductService(proRepo)

	Controller := controllers.NewProductController(proService)

	userGroup := r.Group("/api/products")
	{
		userGroup.POST("/", Controller.CreateProduct)
		userGroup.GET("/:id", Controller.GetProduct)
		userGroup.GET("/", Controller.GetAllProducts)
		userGroup.PUT("/:id", Controller.UpdateProduct)
		userGroup.DELETE("/:id", Controller.DeleteProduct)
	}
}
