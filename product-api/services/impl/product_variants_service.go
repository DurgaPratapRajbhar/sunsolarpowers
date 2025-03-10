package services

import (
	"project/product-api/models"
	"project/product-api/repository"
)

type ProductVariantsServiceImpl struct {
	repo repository.ProductVariantsRepository
}

func NewProductVariantsService(repo repository.ProductVariantsRepository) *ProductVariantsServiceImpl {
	return &ProductVariantsServiceImpl{repo: repo}
}

func (s *ProductVariantsServiceImpl) CreateVariant(variant *models.ProductVariant) error {
	// Business logic or validation can be added here
	return s.repo.CreateVariant(variant)
}

func (s *ProductVariantsServiceImpl) GetVariant(id uint) (*models.ProductVariant, error) {
	return s.repo.GetVariant(id)
}

func (s *ProductVariantsServiceImpl) UpdateVariant(id uint, variant *models.ProductVariant) error {
	// You can add business logic for updates if needed
	return s.repo.UpdateVariant(id, variant)
}

func (s *ProductVariantsServiceImpl) DeleteVariant(id uint) error {
	return s.repo.DeleteVariant(id)
}

func (s *ProductVariantsServiceImpl) GetAllVariants(productID uint) ([]models.ProductVariant, error) {
	return s.repo.GetAllVariants(productID)
}
