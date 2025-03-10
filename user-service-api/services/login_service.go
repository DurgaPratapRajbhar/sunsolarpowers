package services

import "project/user-service-api/models"

type Loginservice interface {
	UserLogin(email string, password string) (*models.UserResponse, error)
}
