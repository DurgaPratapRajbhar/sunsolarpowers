package repository

import "project/product-api/models"

type ProductVariantsRepository interface {
	CreateVariant(variant *models.ProductVariant) error
	GetVariant(id uint) (*models.ProductVariant, error)
	UpdateVariant(id uint, variant *models.ProductVariant) error
	DeleteVariant(id uint) error
	GetAllVariants(productID uint) ([]models.ProductVariant, error)
}
