package impl

import (
	"project/user-service-api/models"
	"project/user-service-api/repository"

	"gorm.io/gorm"
)

type RoleRepositoryImpl struct {
	db *gorm.DB
}

func NewRoleRepository(db *gorm.DB) repository.RoleRepository {

	return &RoleRepositoryImpl{db: db}
}

func (r *RoleRepositoryImpl) Create(role *models.Role) error {
	return r.db.Create(role).Error
}

func (r *RoleRepositoryImpl) GetByID(id uint) (*models.Role, error) {
	var role models.Role
	err := r.db.Preload("Permissions").First(&role, id).Error
	return &role, err
}

func (r *RoleRepositoryImpl) GetAll() ([]models.Role, error) {
	var roles []models.Role
	err := r.db.Preload("Permissions").Find(&roles).Error
	return roles, err
}

func (r *RoleRepositoryImpl) Update(id uint, role *models.Role) error {
	return r.db.Model(&models.Role{}).Where("id = ?", id).Updates(role).Error
}

func (r *RoleRepositoryImpl) Delete(id uint) error {
	return r.db.Delete(&models.Role{}, id).Error
}
