package impl

import (
	"project/user-service-api/models"
	"project/user-service-api/repository"
	"project/user-service-api/services"
)

type PermissionServiceImpl struct {
	repo repository.PermissionRepository
}

func NewPermissionService(repo repository.PermissionRepository) services.PermissionServices {
	return &PermissionServiceImpl{repo: repo}
}

func (s *PermissionServiceImpl) CreatePermission(permission *models.Permission) error {
	return s.repo.Create(permission)
}

func (s *PermissionServiceImpl) GetAllPermission() ([]models.Permission, error) {
	return s.repo.GetAll()
}
