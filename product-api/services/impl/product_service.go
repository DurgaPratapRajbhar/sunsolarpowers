package services

import (
	"project/product-api/models"
	"project/product-api/repository"
	"project/product-api/services"
)

type productService struct {
	repo repository.ProductRepository
}

func NewProductService(repo repository.ProductRepository) services.ProductService {
	return &productService{repo: repo}
}

func (s *productService) CreateProduct(product *models.Product) error {
	return s.repo.CreateProduct(product)
}

func (s *productService) GetProduct(id uint) (*models.Product, error) {
	return s.repo.GetProduct(id)
}

func (s *productService) UpdateProduct(id uint, product *models.Product) error {
	return s.repo.UpdateProduct(id, product)
}

func (s *productService) DeleteProduct(id uint) error {
	return s.repo.DeleteProduct(id)
}

func (s *productService) GetAllProducts() ([]models.Product, error) {
	return s.repo.GetAllProducts()
}
