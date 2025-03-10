package services

import "project/product-api/models"

type CategoryService interface {
	CreateCategory(category *models.Category) error
	GetCategory(id uint) (*models.Category, error)
	UpdateCategory(id uint, category *models.Category) error
	DeleteCategory(id uint) error
	GetAllCategories() ([]models.Category, error)
	FindBySlugCategories(category *models.Category) error
	GetAllCategoriesList() ([]models.Category, error)
}
