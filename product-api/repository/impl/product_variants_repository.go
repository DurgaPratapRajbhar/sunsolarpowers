package repository

import (
	"project/product-api/models"

	"gorm.io/gorm"
)

type ProductVariantsRepositoryImpl struct {
	db *gorm.DB
}

func NewProductVariantsRepository(db *gorm.DB) *ProductVariantsRepositoryImpl {
	return &ProductVariantsRepositoryImpl{db: db}
}

func (r *ProductVariantsRepositoryImpl) CreateVariant(variant *models.ProductVariant) error {
	return r.db.Create(variant).Error
}

func (r *ProductVariantsRepositoryImpl) GetVariant(id uint) (*models.ProductVariant, error) {
	var variant models.ProductVariant
	if err := r.db.First(&variant, id).Error; err != nil {
		return nil, err
	}
	return &variant, nil
}

func (r *ProductVariantsRepositoryImpl) UpdateVariant(id uint, variant *models.ProductVariant) error {
	return r.db.Model(&models.ProductVariant{}).Where("id = ?", id).Updates(variant).Error
}

func (r *ProductVariantsRepositoryImpl) DeleteVariant(id uint) error {
	return r.db.Delete(&models.ProductVariant{}, id).Error
}

func (r *ProductVariantsRepositoryImpl) GetAllVariants(productID uint) ([]models.ProductVariant, error) {
	var variants []models.ProductVariant
	if err := r.db.Where("product_id = ?", productID).Find(&variants).Error; err != nil {
		return nil, err
	}
	return variants, nil
}
