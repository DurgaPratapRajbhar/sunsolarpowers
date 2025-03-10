package services

import (
	"project/product-api/models"
	"project/product-api/repository"
	"project/product-api/services"
)

type frontendService struct {
	repo repository.FrontendRepository
}

func NewFrontendService(repo repository.FrontendRepository) services.FrontendService {
	return &frontendService{repo: repo}
}

func (s *frontendService) GetProductData(slug string) ([]models.Product, error) {
	return s.repo.GetProductData(slug)
}

func (s *frontendService) GetProductsByCategorySlug(slug string) ([]models.Product, error) {
	return s.repo.GetProductsByCategorySlug(slug)
}

func (s *frontendService) ProductSearch(search string) ([]models.Product, error) {
	return s.repo.ProductSearch(search)
}
