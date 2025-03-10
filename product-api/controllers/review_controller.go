package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"

	"project/product-api/models"
	"project/product-api/services"
)

type ProductReviewController struct {
	productReviewService services.ProductReviewService
	validator            *validator.Validate
}

func NewProductReviewController(productReviewService services.ProductReviewService) *ProductReviewController {
	return &ProductReviewController{
		productReviewService: productReviewService,
		validator:            validator.New(),
	}
}

func (prc *ProductReviewController) CreateReview(c *gin.Context) {
	var review models.ProductReview
	if err := c.ShouldBindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate the struct
	if err := prc.validator.Struct(&review); err != nil {

		fmt.Println(err)

		c.JSON(http.StatusBadRequest, gin.H{"error": "Validation failed", "details": err.Error()})
		return
	}

	if err := prc.productReviewService.CreateReview(&review); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product review"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Product review created successfully", "data": review})
}

func (prc *ProductReviewController) GetReview(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid review ID"})
		return
	}

	review, err := prc.productReviewService.GetReview(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product review not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": review})
}

func (prc *ProductReviewController) GetAllReviews(c *gin.Context) {
	productID, err := strconv.Atoi(c.DefaultQuery("product_id", "0"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	reviews, err := prc.productReviewService.GetAllReviews(uint(productID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch product reviews"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reviews})
}

func (prc *ProductReviewController) UpdateReview(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid review ID"})
		return
	}

	var review models.ProductReview
	if err := c.ShouldBindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate the struct
	if err := prc.validator.Struct(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Validation failed", "details": err.Error()})
		return
	}

	if err := prc.productReviewService.UpdateReview(uint(id), &review); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product review"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product review updated successfully"})
}

func (prc *ProductReviewController) DeleteReview(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid review ID"})
		return
	}

	if err := prc.productReviewService.DeleteReview(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product review"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product review deleted successfully"})
}
