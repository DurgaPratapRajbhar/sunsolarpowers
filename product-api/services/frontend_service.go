package services

import "project/product-api/models"

type FrontendService interface {
	GetProductData(slug string) ([]models.Product, error)
	GetProductsByCategorySlug(slug string) ([]models.Product, error)
	ProductSearch(search string) ([]models.Product, error)
}
