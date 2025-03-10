package routes

import (
	"project/product-api/controllers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	repository "project/product-api/repository/impl"
	services "project/product-api/services/impl"
)

func OrderRoutes(r *gin.Engine, db *gorm.DB) {
	// ✅ Initialize Order Repository, Service, and Controller
	orderRepo := repository.NewOrderRepository(db)
	orderService := services.NewOrderService(orderRepo)
	orderController := controllers.NewOrderController(orderService)

	// ✅ Define Order Routes
	orderGroup := r.Group("/api/orders")
	{
		orderGroup.POST("/", orderController.CreateOrder)                   // 📝 Create an order
		orderGroup.GET("/:id", orderController.GetOrderByID)                // 📋 Get order by ID
		orderGroup.GET("/user/:id", orderController.GetOrdersByUserID)      // 📋 Get orders by user ID
		orderGroup.PUT("/:id/status", orderController.UpdateOrderStatus)    // 🔄 Update order status
		orderGroup.PUT("/:id/payment", orderController.UpdatePaymentStatus) // 💰 Update payment status
		orderGroup.DELETE("/:id", orderController.DeleteOrder)              // ❌ Delete an order
	}
}
