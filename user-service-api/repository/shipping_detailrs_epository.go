package repository

import (
	"project/user-service-api/models"
)

type ShippingDetailsRepository interface {
	Create(shippingDetail *models.ShippingDetail) error
	GetByID(id uint) (*models.ShippingDetail, error)
	GetAll() ([]models.ShippingDetail, error)
	Update(id uint, shippingDetail *models.ShippingDetail) error
	Delete(id uint) error
}
