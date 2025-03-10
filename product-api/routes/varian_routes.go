package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"project/product-api/controllers"
	repository "project/product-api/repository/impl"
	services "project/product-api/services/impl"
)

func VariantRoutes(route *gin.Engine, db *gorm.DB) {

	proRepo := repository.NewProductVariantsRepository(db)
	proService := services.NewProductVariantsService(proRepo)

	Controller := controllers.NewProductVariantController(proService)
	VariantGroup := route.Group("/api/product-variants")
	{
		VariantGroup.POST("/", Controller.CreateVariant)
		VariantGroup.GET("/:id", Controller.GetVariant)
		VariantGroup.GET("/", Controller.GetAllVariants)
		VariantGroup.PUT("/:id", Controller.UpdateVariant)
		VariantGroup.DELETE("/:id", Controller.DeleteVariant)
	}

}
