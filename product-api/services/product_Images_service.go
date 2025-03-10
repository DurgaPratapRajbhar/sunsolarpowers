package services

import "project/product-api/models"

type ProductImagesServices interface {
	CreateProductImage(productImage *models.ProductImage) error
	GetProductImage(id uint64) (*models.ProductImage, error)
	GetAllProductImages(productID uint64) ([]models.ProductImage, error)
	UpdateProductImage(id uint64, productImage *models.ProductImage) error
	DeleteProductImage(id uint64) error
	SetPrimaryProductImage(id uint64) error
	ValidateAndStoreImage(file []byte, filename string) (string, error) // Add image validation and storage
}
