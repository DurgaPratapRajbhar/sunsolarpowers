package routes

import (
	"project/order-api-service/handlers"
	"project/order-api-service/repository/impl"
	serviceImpl "project/order-api-service/services/impl"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB) {
	orderRepo := impl.NewOrderRepository(db)
	orderService := serviceImpl.NewOrderService(orderRepo)
	orderHandler := handlers.NewOrderHandler(orderService)

	api := r.Group("/api/v1")
	{
		orders := api.Group("/orders")
		{
			orders.POST("/", orderHandler.CreateOrder)
			orders.GET("/:id", orderHandler.GetOrder)
			orders.GET("/user/:userId", orderHandler.GetUserOrders)
			orders.GET("/", orderHandler.GetAllOrders)
			orders.PUT("/:id", orderHandler.UpdateOrder)
			orders.DELETE("/:id", orderHandler.DeleteOrder)
			orders.PATCH("/:id/status", orderHandler.UpdateOrderStatus)
			orders.PATCH("/:id/payment", orderHandler.UpdatePaymentStatus)
		}
	}
}
