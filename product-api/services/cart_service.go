package services

import "project/product-api/models"

type CartService interface {
	AddToCart(cart *models.Cart) error
	GetCartByUser(UserID uint64) ([]models.Cart, error)
	UpdateCart(cartID int64, cart *models.Cart) error
	RemoveFromCart(cartID int64) error
	ClearCart(cartID int64) error
}
