package routes

import (
	"project/product-api/controllers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	repository "project/product-api/repository/impl"
	services "project/product-api/services/impl"
)

func CartRoutes(r *gin.Engine, db *gorm.DB) {
	// ✅ Correct Repository and Service Initialization
	cartRepo := repository.NewCartRepository(db)
	cartService := services.NewCartService(cartRepo)
	cartController := controllers.NewCartController(cartService) // ✅ Correct Initialization

	// ✅ Define Routes
	cartGroup := r.Group("/api/cart")
	{
		cartGroup.POST("/", cartController.AddToCart)            // 🛒 Add item
		cartGroup.GET("/:id", cartController.GetCartByUser)      // 📋 Get cart by user ID
		cartGroup.GET("/", cartController.GetCartByUser)         // 📋 Get all cart items
		cartGroup.PUT("/:id", cartController.UpdateCart)         // 🔄 Update cart
		cartGroup.DELETE("/:id", cartController.RemoveFromCart)  // ❌ Remove item
		cartGroup.DELETE("/clear/:id", cartController.ClearCart) // 🚮 Clear cart
	}
}
