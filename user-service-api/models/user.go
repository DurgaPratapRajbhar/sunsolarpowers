package models

import (
	"errors"
	"fmt"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

const PasswordHashCost = bcrypt.DefaultCost

type User struct {
	ID           uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	FirstName    string    `gorm:"size:100;not null" json:"first_name" validate:"required"`
	LastName     string    `gorm:"size:100;not null" json:"last_name" validate:"required"`
	Email        string    `gorm:"size:255;unique;not null" json:"email" validate:"required,email"`
	MobileNumber string    `gorm:"size:15;unique;not null" json:"mobile_number" validate:"required"`
	Password     string    `gorm:"size:255;not null" json:"password"` // Hide password in JSON response
	RoleID       uint      `gorm:"not null" json:"role_id"`           // Explicit Foreign Key
	Role         Role      `gorm:"foreignKey:RoleID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

type UserResponse struct {
	ID           uint   `json:"id"`
	FirstName    string `json:"first_name"`
	LastName     string `json:"last_name"`
	Email        string `json:"email"`
	MobileNumber string `json:"mobile_number"`
	RoleID       uint   `json:"role_id"`
	Token        string `json:"token"`
}

func (User) TableName() string {
	return "users"
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	// Debugging: Check if password exists
	fmt.Println("Before hashing:", u.Password)

	// Ensure password is not empty
	if u.Password == "" {
		return errors.New("password cannot be empty")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)

	// Debugging: Check if password is hashed
	fmt.Println("After hashing:", u.Password)

	return nil
}

func (u *User) ComparePassword(plainPassword string) bool {

	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(plainPassword))
	return err == nil
}
