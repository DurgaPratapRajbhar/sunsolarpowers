package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"project/product-api/controllers"
	repository "project/product-api/repository/impl"
	services "project/product-api/services/impl"
)

func ReviewRoutes(route *gin.Engine, db *gorm.DB) {
	proReviewRepo := repository.NewProductReviewRepository(db)
	proReviewService := services.NewProductReviewService(proReviewRepo)
	proReviewController := controllers.NewProductReviewController(proReviewService)

	reviewGroup := route.Group("/api/product-reviews")
	{
		reviewGroup.POST("/", proReviewController.CreateReview)
		reviewGroup.GET("/:id", proReviewController.GetReview)
		reviewGroup.GET("/", proReviewController.GetAllReviews)
		reviewGroup.PUT("/:id", proReviewController.UpdateReview)
		reviewGroup.DELETE("/:id", proReviewController.DeleteReview)
	}
}
