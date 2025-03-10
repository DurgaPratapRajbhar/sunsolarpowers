package models

import (
	"time"

	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type Product struct {
	ID          uint64    `gorm:"primaryKey;autoIncrement" json:"id"`
	CategoryID  uint64    `gorm:"index;not null" json:"category_id"` // Foreign key to the category
	Name        string    `gorm:"type:varchar(255);not null" json:"name" validate:"required,min=3,max=255"`
	Slug        string    `gorm:"type:varchar(255);unique;not null" json:"slug" validate:"required,regexp=^[a-z0-9]+(?:-[a-z0-9]+)*$"`
	Description string    `gorm:"type:text" json:"description" validate:"required,min=5"`
	Price       float64   `gorm:"type:decimal(10,2);not null" json:"price" validate:"required,gt=0"`
	Discount    float64   `gorm:"type:decimal(5,2);default:0" json:"discount" validate:"gte=0,lte=100"`
	Stock       int       `gorm:"type:int;not null" json:"stock" validate:"gte=0"`
	Brand       string    `gorm:"type:varchar(100);not null" json:"brand" validate:"required,min=2,max=100"`
	SKU         string    `gorm:"type:varchar(100);unique;not null" json:"sku" validate:"required"`
	Status      string    `gorm:"type:varchar(20);not null;default:'active'" json:"status" validate:"oneof=active inactive"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	PrimaryImage *string `json:"primary_image"`

	Images []ProductImage `gorm:"foreignKey:ProductID;references:ID" json:"images"`
	// Relationship with the category
	Category Category `gorm:"foreignKey:CategoryID;references:ID" json:"category"`
	// Category Category `gorm:"foreignKey:CategoryID;references:ID" json:"category" validate:"required,dive"`
}

// TableName overrides the default table name
func (Product) TableName() string {
	return "products"
}

// Validate performs custom validation for the Product model.
func (product *Product) Validate() error {
	validate := validator.New()
	return validate.Struct(product)
}

// BeforeCreate hook to set timestamps
func (product *Product) BeforeCreate(tx *gorm.DB) (err error) {
	product.CreatedAt = time.Now()
	product.UpdatedAt = time.Now()
	return
}

// BeforeUpdate hook to set timestamps
func (product *Product) BeforeUpdate(tx *gorm.DB) (err error) {
	product.UpdatedAt = time.Now()
	return
}
