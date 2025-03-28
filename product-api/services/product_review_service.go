package services

import "project/product-api/models"

type ProductReviewService interface {
	CreateReview(review *models.ProductReview) error
	GetReview(id uint) (*models.ProductReview, error)
	UpdateReview(id uint, review *models.ProductReview) error
	DeleteReview(id uint) error
	GetAllReviews(productID uint) ([]models.ProductReview, error)
}
