package repository

import (
	"project/user-service-api/models"
)

type PermissionRepository interface {
	Create(permission *models.Permission) error
	GetAll() ([]models.Permission, error)
}
