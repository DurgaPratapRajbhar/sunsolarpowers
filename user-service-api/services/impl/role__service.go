package impl

import (
	"project/user-service-api/models"
	"project/user-service-api/repository"
	"project/user-service-api/services"
)

type RoleServiceImpl struct {
	repo repository.RoleRepository
}

func NewRoleService(repo repository.RoleRepository) services.RoleServices {
	return &RoleServiceImpl{repo: repo}
}

func (s *RoleServiceImpl) CreateRole(role *models.Role) error {
	return s.repo.Create(role)
}

func (s *RoleServiceImpl) GetByIDRole(id uint) (*models.Role, error) {
	return s.repo.GetByID(id)
}

func (s *RoleServiceImpl) GetAllRole() ([]models.Role, error) {
	return s.repo.GetAll()
}

func (s *RoleServiceImpl) UpdateRole(id uint, role *models.Role) error {
	return s.repo.Update(id, role)
}

func (s *RoleServiceImpl) DeleteRole(id uint) error {
	return s.repo.Delete(id)
}
