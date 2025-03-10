package impl

import (
	"project/user-service-api/models"
	"project/user-service-api/repository"

	"gorm.io/gorm"
)

type PermissionRepositoryImpl struct {
	db *gorm.DB
}

func NewPermissionRepository(db *gorm.DB) repository.PermissionRepository {

	return &PermissionRepositoryImpl{db: db}
}

func (r *PermissionRepositoryImpl) Create(permission *models.Permission) error {
	return r.db.Create(permission).Error
}

func (r *PermissionRepositoryImpl) GetAll() ([]models.Permission, error) {
	var permissions []models.Permission
	err := r.db.Find(&permissions).Error
	return permissions, err
}
