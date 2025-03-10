package services

import "project/product-api/models"

type ProductVariantsServices interface {
	CreateVariant(variant *models.ProductVariant) error
	GetVariant(id uint) (*models.ProductVariant, error)
	UpdateVariant(id uint, variant *models.ProductVariant) error
	DeleteVariant(id uint) error
	GetAllVariants(productID uint) ([]models.ProductVariant, error)
}
