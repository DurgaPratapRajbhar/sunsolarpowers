package repository

import (
	"project/user-service-api/models"
)

type RoleRepository interface {
	Create(role *models.Role) error
	GetByID(id uint) (*models.Role, error)
	GetAll() ([]models.Role, error)
	Update(id uint, role *models.Role) error
	Delete(id uint) error
}
