package services

import (
	"project/product-api/models"
	"project/product-api/repository"
	"project/product-api/services"
)

type CartServiceImp struct {
	services repository.CartRepository
}

func NewCartService(repo repository.CartRepository) services.CartService {
	return &CartServiceImp{services: repo}
}

func (repo CartServiceImp) AddToCart(cart *models.Cart) error {
	err := repo.services.AddToCart(cart)
	if err != nil {
		return err
	}

	return nil
}

func (repo CartServiceImp) GetCartByUser(UserID uint64) ([]models.Cart, error) {
	carts, err := repo.services.GetCartByUser(UserID)
	if err != nil {
		return nil, err
	}
	return carts, nil
}

func (repo CartServiceImp) UpdateCart(cartID int64, cart *models.Cart) error {
	err := repo.services.UpdateCart(cartID, cart)
	if err != nil {
		return err
	}
	return nil
}

func (repo CartServiceImp) RemoveFromCart(cartID int64) error {
	err := repo.services.RemoveFromCart(cartID)
	if err != nil {
		return err
	}
	return nil
}

func (repo CartServiceImp) ClearCart(cartID int64) error {
	err := repo.services.ClearCart(cartID)
	if err != nil {
		return err
	}
	return nil
}
