package services

import (
	"project/user-service-api/models"
)

type ShippingDetailsService interface {
	CreateShippingDetail(shippingDetails *models.ShippingDetail) error
	GetShippingDetail(id uint) (*models.ShippingDetail, error)
	GetAllShippingDetail() ([]models.ShippingDetail, error)
	UpdateShippingDetail(id uint, shippingDetails *models.ShippingDetail) error
	DeleteShippingDetail(id uint) error
}
