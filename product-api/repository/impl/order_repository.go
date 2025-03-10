package repository

import (
	"project/product-api/models"
	"project/product-api/repository"

	"gorm.io/gorm"
)

type OrderRepositoryImpl struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) repository.OrderRepository {
	return &OrderRepositoryImpl{db: db}
}

func (repo *OrderRepositoryImpl) CreateOrder(order *models.Order) error {
	return repo.db.Create(order).Error
}

func (repo *OrderRepositoryImpl) GetOrderByID(orderID uint64) (*models.Order, error) {
	var order models.Order
	err := repo.db.Preload("OrderItems").First(&order, orderID).Error
	return &order, err
}

func (repo *OrderRepositoryImpl) GetOrdersByUserID(userID uint64) ([]models.Order, error) {
	var orders []models.Order
	err := repo.db.Where("user_id = ?", userID).Preload("OrderItems").Find(&orders).Error
	return orders, err
}

func (repo *OrderRepositoryImpl) UpdateOrderStatus(orderID uint64, status string) error {
	return repo.db.Model(&models.Order{}).Where("id = ?", orderID).Update("status", status).Error
}

func (repo *OrderRepositoryImpl) UpdatePaymentStatus(orderID uint64, status string, paymentID *string) error {
	updateFields := map[string]interface{}{
		"payment_status": status,
	}
	if paymentID != nil {
		updateFields["payment_id"] = *paymentID
	}
	return repo.db.Model(&models.Order{}).Where("id = ?", orderID).Updates(updateFields).Error
}

func (repo *OrderRepositoryImpl) DeleteOrder(orderID uint64) error {
	return repo.db.Where("id = ?", orderID).Delete(&models.Order{}).Error
}
