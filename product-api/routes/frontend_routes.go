package routes

import (
	"project/product-api/controllers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	repository "project/product-api/repository/impl"
	services "project/product-api/services/impl"
)

func RrontendRoutes(r *gin.Engine, db *gorm.DB) {

	prodRepo := repository.NewFrontendRepository(db)
	prodService := services.NewFrontendService(prodRepo)
	prodController := controllers.NewFrontendController(prodService)

	productGroup := r.Group("/api/v1")
	{

		productGroup.GET("/category/:slug", prodController.GetProductsByCategorySlug)
		productGroup.GET("/product/:slug", prodController.GetProductData)
		productGroup.GET("/products", prodController.ProductSearch)

	}
}
