package impl

import (
	"project/user-service-api/models"
	"project/user-service-api/repository"
	"project/user-service-api/services"
)

type UserServiceImpl struct {
	repo repository.UserRepository
}

func NewUserService(repo repository.UserRepository) services.UserService {
	return &UserServiceImpl{repo: repo}
}

func (s *UserServiceImpl) CreateUser(user *models.User) error {

	return s.repo.Create(user)
}

func (s *UserServiceImpl) GetUser(id uint) (*models.User, error) {
	return s.repo.GetByID(id)
}

func (s *UserServiceImpl) GetAllUsers() ([]models.User, error) {
	return s.repo.GetAll()
}

func (s *UserServiceImpl) UpdateUser(id uint, user *models.User) error {
	return s.repo.Update(id, user)
}

func (s *UserServiceImpl) DeleteUser(id uint) error {
	return s.repo.Delete(id)
}
