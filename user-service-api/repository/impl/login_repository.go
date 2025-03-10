package impl

import (
	"errors"
	"fmt"
	"project/user-service-api/models"
	"project/user-service-api/repository"

	"gorm.io/gorm"
)

type loginRepositoryImpl struct {
	db *gorm.DB
}

func NewLoginRepository(db *gorm.DB) repository.LoginRepository {
	return &loginRepositoryImpl{db: db}
}

func (r *loginRepositoryImpl) Login(email, password string) (*models.User, error) {
	var user models.User

	if err := r.db.Where("email = ?", email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("email not found")
		}
		return nil, errors.New("database error")
	}

	fmt.Println("Stored Hash:", user.Password)
	fmt.Println("Entered Password:", password)

	// Compare stored hash with entered password
	if !user.ComparePassword(password) {
		fmt.Println("Password mismatch!")
		return nil, errors.New("incorrect password")
	}

	return &user, nil
}
