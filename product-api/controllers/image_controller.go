package controllers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"time"

	"project/product-api/models"
	"project/product-api/services"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type ProductImageController struct {
	productImageService services.ProductImagesServices
	validator           *validator.Validate
}

// NewProductImageController creates a new ProductImageController instance
func NewProductImageController(productImageService services.ProductImagesServices) *ProductImageController {
	validate := validator.New()
	validate.RegisterValidation("regexp", func(fl validator.FieldLevel) bool {
		pattern := fl.Param() // Get the regex pattern from the tag
		match, err := regexp.MatchString(pattern, fl.Field().String())
		return err == nil && match
	})
	return &ProductImageController{
		productImageService: productImageService,
		validator:           validate,
	}
}

func (pvc *ProductImageController) CreateImage(c *gin.Context) {
	productIDStr := c.PostForm("product_id")
	if productIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Product ID is required"})
		return
	}

	productID, err := strconv.ParseUint(productIDStr, 10, 64)
	if err != nil || productID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	// Get file from request
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image file is required"})
		return
	}

	// Validate file extension
	allowedExtensions := map[string]bool{".jpg": true, ".jpeg": true, ".png": true}
	fileExt := filepath.Ext(file.Filename)
	if !allowedExtensions[fileExt] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file type! Only JPG and PNG are allowed"})
		return
	}

	// Validate file size (Max 2MB)
	if file.Size > 2*1024*1024 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File size exceeds 2MB limit"})
		return
	}

	// Get additional fields
	altText := c.PostForm("alt_text")
	if len(altText) > 255 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Alt Text must be 255 characters or less"})
		return
	}

	isPrimary, _ := strconv.ParseBool(c.PostForm("is_primary"))

	// Define the storage directory
	saveDir := "../../image_gallery/product"
	if err := os.MkdirAll(saveDir, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
		return
	}

	// Generate unique filename
	filename := fmt.Sprintf("%d_%d%s", productID, time.Now().Unix(), fileExt)
	filePath := filepath.Join(saveDir, filename)  // Full path for saving
	dbPath := fmt.Sprintf("product/%s", filename) // Relative path for DB storage

	// Save file
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
		return
	}

	// Construct ProductImage struct
	image := models.ProductImage{
		ProductID: productID,
		ImageURL:  dbPath, // Store only the relative path
		AltText:   altText,
		IsPrimary: isPrimary,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// Validate struct
	if err := pvc.validator.Struct(image); err != nil {
		errors := []string{}
		for _, err := range err.(validator.ValidationErrors) {
			errors = append(errors, fmt.Sprintf("Field '%s' failed on '%s' validation", err.Field(), err.Tag()))
		}
		c.JSON(http.StatusBadRequest, gin.H{"errors": errors})
		return
	}

	// Save to DB
	if err := pvc.productImageService.CreateProductImage(&image); err != nil {
		_ = os.Remove(filePath) // Remove file if DB insert fails
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image record"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Image uploaded successfully!", "data": image})
}

func (pvc *ProductImageController) UpdateImage(c *gin.Context) {
	// Parse image ID from URL param
	imageIDStr := c.Param("id")
	imageID, err := strconv.ParseUint(imageIDStr, 10, 64)
	if err != nil || imageID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid image ID"})
		return
	}

	// Fetch existing image from DB
	existingImage, err := pvc.productImageService.GetProductImage(imageID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Image not found"})
		return
	}

	// Parse form fields
	productIDStr := c.PostForm("product_id")
	if productIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Product ID is required"})
		return
	}

	productID, err := strconv.ParseUint(productIDStr, 10, 64)
	if err != nil || productID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	altText := c.PostForm("alt_text")
	if len(altText) > 255 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Alt Text must be 255 characters or less"})
		return
	}

	isPrimary, _ := strconv.ParseBool(c.PostForm("is_primary"))

	// Define storage directory
	saveDir := "../../image_gallery/product"
	if err := os.MkdirAll(saveDir, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
		return
	}

	// Check if a new file is uploaded
	file, err := c.FormFile("image")
	var dbPath string

	if err == nil {
		// Validate file extension
		allowedExtensions := map[string]bool{".jpg": true, ".jpeg": true, ".png": true}
		fileExt := filepath.Ext(file.Filename)
		if !allowedExtensions[fileExt] {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file type! Only JPG and PNG are allowed"})
			return
		}

		// Validate file size (Max 2MB)
		if file.Size > 2*1024*1024 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "File size exceeds 2MB limit"})
			return
		}

		// Generate unique filename
		filename := fmt.Sprintf("%d_%d%s", productID, time.Now().Unix(), fileExt)
		filePath := filepath.Join(saveDir, filename)
		dbPath = fmt.Sprintf("product/%s", filename)

		// Save new file
		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
			return
		}

		// Remove old file if a new one is uploaded
		oldFilePath := filepath.Join("../../image_gallery", existingImage.ImageURL)
		_ = os.Remove(oldFilePath)
	} else {
		// Keep the old image path if no new file was uploaded
		dbPath = existingImage.ImageURL
	}

	// Construct updated ProductImage struct
	image := models.ProductImage{

		ProductID: productID,
		ImageURL:  dbPath,
		AltText:   altText,
		IsPrimary: isPrimary,
		UpdatedAt: time.Now(),
	}

	// Validate struct
	if err := pvc.validator.Struct(image); err != nil {
		errors := []string{}
		for _, err := range err.(validator.ValidationErrors) {
			errors = append(errors, fmt.Sprintf("Field '%s' failed on '%s' validation", err.Field(), err.Tag()))
		}
		c.JSON(http.StatusBadRequest, gin.H{"errors": errors})
		return
	}

	// Update record in DB
	if err := pvc.productImageService.UpdateProductImage(imageID, &image); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update image record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Image updated successfully!", "data": image})
}

func (pvc *ProductImageController) DeleteImage(c *gin.Context) {
	imageID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid image ID"})
		return
	}

	if err := pvc.productImageService.DeleteProductImage(imageID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete image"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Image deleted successfully"})
}

func (pvc *ProductImageController) GetImageByID(c *gin.Context) {
	imageID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid image ID"})
		return
	}

	image, err := pvc.productImageService.GetProductImage(imageID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Image not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": image})
}

func (pvc *ProductImageController) GetAllImages(c *gin.Context) {
	productIDStr := c.Param("product_id") // Get the product_id from URL parameter

	fmt.Println(productIDStr)
	productID, err := strconv.ParseUint(productIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	images, err := pvc.productImageService.GetAllProductImages(productID)

	fmt.Println(images)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve images"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": images})
}
