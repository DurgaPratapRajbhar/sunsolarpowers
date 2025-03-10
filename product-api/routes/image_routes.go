package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"project/product-api/controllers"
	repository "project/product-api/repository/impl"
	services "project/product-api/services/impl"
)

func ImageRoutes(route *gin.Engine, db *gorm.DB) {

	proRepo := repository.NewProductImagesRepository(db)
	proService := services.NewProductImagesService(proRepo)

	Controller := controllers.NewProductImageController(proService)
	imageGroup := route.Group("/api/product-images")
	{
		imageGroup.POST("/", Controller.CreateImage)
		imageGroup.GET("/by-id/:id", Controller.GetImageByID)
		imageGroup.GET("/by-product/:product_id", Controller.GetAllImages)
		imageGroup.PUT("/:id", Controller.UpdateImage)
		imageGroup.DELETE("/:id", Controller.DeleteImage)
	}

}
