package services

import "project/product-api/models"

type ProductService interface {
	CreateProduct(product *models.Product) error
	GetProduct(id uint) (*models.Product, error)
	UpdateProduct(id uint, product *models.Product) error
	DeleteProduct(id uint) error
	GetAllProducts() ([]models.Product, error)
}
