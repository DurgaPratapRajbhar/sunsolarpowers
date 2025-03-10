package repository

import (
	"project/product-api/models"
	"project/product-api/repository"

	"gorm.io/gorm"
)

type CartRepository struct {
	db *gorm.DB
}

func NewCartRepository(db *gorm.DB) repository.CartRepository {

	return &CartRepository{db: db}
}

// func (repo CartRepository) AddToCart(cart *models.Cart) error {

// 	err := repo.db.Create(cart).Error
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

func (r *CartRepository) AddToCart(cart *models.Cart) error {
	var existingCart models.Cart

	// ✅ Check if product is already in cart
	err := r.db.Where("user_id = ? AND product_id = ?", cart.UserID, cart.ProductID).First(&existingCart).Error
	if err == nil {
		// ✅ If product exists, update quantity instead of adding new row
		existingCart.Quantity += cart.Quantity
		return r.db.Save(&existingCart).Error
	}

	// ✅ If product doesn't exist, create new entry
	return r.db.Create(cart).Error
}

// func (repo CartRepository) GetCartByUser(UserID uint64) ([]models.Cart, error) {
// 	var carts []models.Cart
// 	err := repo.db.Where("user_id=?", UserID).Find(&carts).Error
// 	if err != nil {
// 		return nil, err
// 	}
// 	return carts, nil
// }

// func (repo CartRepository) GetCartByUser(UserID uint64) ([]models.Cart, error) {
// 	var carts []models.Cart
// 	err := repo.db.
// 		Preload("ProductImage.IsPrimary", "is_primary = ?", true).
// 		Preload("Product").Where("user_id = ?", UserID).Find(&carts).Error
// 	if err != nil {
// 		return nil, err
// 	}
// 	return carts, nil
// }

func (repo CartRepository) GetCartByUser(UserID uint64) ([]models.Cart, error) {
	var carts []models.Cart
	err := repo.db.
		Preload("Product", func(db *gorm.DB) *gorm.DB {
			return db.Preload("Images", "is_primary = ?", true) // Load only primary image
		}).
		Where("user_id = ?", UserID).
		Find(&carts).Error

	if err != nil {
		return nil, err
	}

	// Assign the primary image URL
	for i := range carts {
		if len(carts[i].Product.Images) > 0 {
			carts[i].Product.PrimaryImage = &carts[i].Product.Images[0].ImageURL
		}
	}

	return carts, nil
}

func (repo CartRepository) UpdateCart(cartID int64, cart *models.Cart) error {
	err := repo.db.Model(&models.Cart{}).Where("id=?", cartID).Updates(cart).Error
	if err != nil {
		return err
	}
	return nil
}

func (repo CartRepository) RemoveFromCart(cartID int64) error {
	err := repo.db.Delete(&models.Cart{}, cartID).Error
	if err != nil {
		return err
	}
	return nil
}

func (repo CartRepository) ClearCart(cartID int64) error {
	err := repo.db.Where("user_id = ?", cartID).Delete(&models.Cart{}).Error
	if err != nil {
		return err
	}
	return nil
}
