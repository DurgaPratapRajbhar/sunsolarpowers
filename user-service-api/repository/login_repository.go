package repository

import (
	"project/user-service-api/models"
)

type LoginRepository interface {
	Login(email string, password string) (*models.User, error)
}
