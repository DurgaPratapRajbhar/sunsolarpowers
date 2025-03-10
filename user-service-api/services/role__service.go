package services

import (
	"project/user-service-api/models"
)

type RoleServices interface {
	CreateRole(role *models.Role) error
	GetByIDRole(id uint) (*models.Role, error)
	GetAllRole() ([]models.Role, error)
	UpdateRole(id uint, role *models.Role) error
	DeleteRole(id uint) error
}
