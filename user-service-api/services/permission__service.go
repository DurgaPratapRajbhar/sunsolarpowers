package services

import (
	"project/user-service-api/models"
)

type PermissionServices interface {
	CreatePermission(permission *models.Permission) error
	GetAllPermission() ([]models.Permission, error)
}
