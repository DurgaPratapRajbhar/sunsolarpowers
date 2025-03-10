package repository

import "project/product-api/models"

type OrderRepository interface {
	CreateOrder(order *models.Order) error
	GetOrderByID(orderID uint64) (*models.Order, error)
	GetOrdersByUserID(userID uint64) ([]models.Order, error)
	UpdateOrderStatus(orderID uint64, status string) error
	UpdatePaymentStatus(orderID uint64, status string, paymentID *string) error
	DeleteOrder(orderID uint64) error
}
