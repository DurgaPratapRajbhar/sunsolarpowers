package controllers

import (
	"net/http"
	"project/product-api/models"
	"project/product-api/services"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type ProductVariantController struct {
	productVariantService services.ProductVariantsServices
	validator             *validator.Validate
}

// NewProductVariantController creates a new ProductVariantController instance
func NewProductVariantController(productVariantService services.ProductVariantsServices) *ProductVariantController {
	return &ProductVariantController{
		productVariantService: productVariantService,
		validator:             validator.New(),
	}
}

// CreateVariant creates a new product variant
func (pvc *ProductVariantController) CreateVariant(c *gin.Context) {
	var variant models.ProductVariant
	if err := c.ShouldBindJSON(&variant); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Validate input
	if err := pvc.validator.Struct(&variant); err != nil {
		validationErrors := []string{}
		for _, e := range err.(validator.ValidationErrors) {
			validationErrors = append(validationErrors, strings.Join([]string{e.Field(), e.Tag(), e.Param()}, " "))
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "Validation failed", "details": validationErrors})
		return
	}

	// Call service to create product variant
	if err := pvc.productVariantService.CreateVariant(&variant); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create variant"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Product variant created successfully", "data": variant})
}

// GetVariant retrieves a product variant by ID
func (pvc *ProductVariantController) GetVariant(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid variant ID"})
		return
	}

	variant, err := pvc.productVariantService.GetVariant(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Variant not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": variant})
}

// GetAllVariants retrieves all variants of a product
func (pvc *ProductVariantController) GetAllVariants(c *gin.Context) {
	productID, err := strconv.Atoi(c.DefaultQuery("productID", "0"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	variants, err := pvc.productVariantService.GetAllVariants(uint(productID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch variants"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": variants})
}

// UpdateVariant updates an existing product variant
func (pvc *ProductVariantController) UpdateVariant(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid variant ID"})
		return
	}

	var variant models.ProductVariant
	if err := c.ShouldBindJSON(&variant); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Validate input
	if err := pvc.validator.Struct(&variant); err != nil {
		validationErrors := []string{}
		for _, e := range err.(validator.ValidationErrors) {
			validationErrors = append(validationErrors, strings.Join([]string{e.Field(), e.Tag(), e.Param()}, " "))
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "Validation failed", "details": validationErrors})
		return
	}

	// Call service to update product variant
	if err := pvc.productVariantService.UpdateVariant(uint(id), &variant); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update variant"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product variant updated successfully"})
}

// DeleteVariant deletes a product variant by ID
func (pvc *ProductVariantController) DeleteVariant(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid variant ID"})
		return
	}

	if err := pvc.productVariantService.DeleteVariant(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete variant"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product variant deleted successfully"})
}
