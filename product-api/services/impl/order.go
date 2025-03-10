package services

import (
	"project/product-api/models"
	"project/product-api/repository"
	"project/product-api/services"
)

type OrderServiceImp struct {
	repo repository.OrderRepository
}

func NewOrderService(rep repository.OrderRepository) services.OrderService {

	return &OrderServiceImp{repo: rep}
}

func (services *OrderServiceImp) CreateOrder(order *models.Order) error {
	return services.repo.CreateOrder(order)
}

func (services *OrderServiceImp) GetOrderByID(orderID uint64) (*models.Order, error) {
	order, err := services.repo.GetOrderByID(orderID)
	return order, err
}

func (services *OrderServiceImp) GetOrdersByUserID(userID uint64) ([]models.Order, error) {

	orders, err := services.repo.GetOrdersByUserID(userID)
	return orders, err
}

func (services *OrderServiceImp) UpdateOrderStatus(orderID uint64, status string) error {
	return services.repo.UpdateOrderStatus(orderID, status)
}

func (services *OrderServiceImp) UpdatePaymentStatus(orderID uint64, status string, paymentID *string) error {
	return services.repo.UpdatePaymentStatus(orderID, status, paymentID)

}

func (services *OrderServiceImp) DeleteOrder(orderID uint64) error {
	return services.repo.DeleteOrder(orderID)
}
