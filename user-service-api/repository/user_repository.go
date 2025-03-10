package repository

import (
	"project/user-service-api/models"
)

type UserRepository interface {
	Create(user *models.User) error
	GetByID(id uint) (*models.User, error)
	GetAll() ([]models.User, error)
	Update(id uint, user *models.User) error
	Delete(id uint) error
}
