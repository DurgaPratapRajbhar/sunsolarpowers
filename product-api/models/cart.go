package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type Cart struct {
	ID        uint64    `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID    uint64    `gorm:"index;not null" json:"user_id"`
	ProductID uint64    `gorm:"index;not null" json:"product_id"`
	Quantity  int       `gorm:"type:int;not null;default:1" json:"quantity" validate:"required"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
	Product   Product   `gorm:"foreignKey:ProductID;references:ID" json:"product"`
}

func (Cart) TableName() string {
	return "carts"
}

func (cart *Cart) Validate() error {
	validate := validator.New()
	return validate.Struct(cart)
}
