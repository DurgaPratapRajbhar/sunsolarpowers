package services

import (
	"project/user-service-api/models"
)

type UserService interface {
	CreateUser(user *models.User) error
	GetUser(id uint) (*models.User, error)
	GetAllUsers() ([]models.User, error)
	UpdateUser(id uint, user *models.User) error
	DeleteUser(id uint) error
}
