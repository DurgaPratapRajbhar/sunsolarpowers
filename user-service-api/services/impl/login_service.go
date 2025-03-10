package impl

import (
	"errors"
	"project/shared/jwt"
	"project/user-service-api/models"
	"project/user-service-api/repository"
	"project/user-service-api/services"
)

type LoginRepositoryImpl struct {
	repo repository.LoginRepository
}

func NewLoginService(repo repository.LoginRepository) services.Loginservice {
	return &LoginRepositoryImpl{repo: repo}
}

func (r *LoginRepositoryImpl) UserLogin(email string, password string) (*models.UserResponse, error) {
	user, err := r.repo.Login(email, password)
	if err != nil {
		return nil, err
	}

	token, err := jwt.GenerateToken(user.ID, user.Email)
	if err != nil {
		return nil, errors.New("failed to generate token")
	}

	loginDetails := &models.UserResponse{
		ID:           user.ID,
		FirstName:    user.FirstName,
		LastName:     user.LastName,
		Email:        user.Email,
		MobileNumber: user.MobileNumber,
		RoleID:       user.RoleID,
		Token:        token,
	}

	return loginDetails, nil
}
