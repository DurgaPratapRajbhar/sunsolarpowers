package controllers

import (
	"fmt"
	"math/rand"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"

	"project/product-api/models"
	"project/product-api/services"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	// "golang.org/x/exp/rand"
)

type ProductController struct {
	productService services.ProductService
	validate       *validator.Validate
}

type Product struct {
	Name        string  `json:"name" validate:"required"`
	Slug        string  `json:"slug" `
	Description string  `json:"description" validate:"required"`
	Price       float64 `json:"price" validate:"required,gt=0"`
	Brand       string  `json:"brand" validate:"required"`
	CategoryID  uint64  `json:"category_id" validate:"required"`
	Discount    float64 `json:"discount" validate:"gte=0"`
	Stock       int     `json:"stock" validate:"gte=0"`
	SKU         string  `json:"sku" validate:"required"`
	Status      string  `json:"status" validate:"required,oneof=active inactive"`
}

// NewProductController initializes the product controller and registers custom validators
func NewProductController(productService services.ProductService) *ProductController {
	validate := validator.New()

	// Registering the "regexp" validation manually
	validate.RegisterValidation("regexp", func(fl validator.FieldLevel) bool {
		pattern := fl.Param() // Get the regex pattern from the tag
		match, err := regexp.MatchString(pattern, fl.Field().String())
		return err == nil && match
	})

	return &ProductController{
		productService: productService,
		validate:       validate,
	}
}

func (pc *ProductController) CreateProduct(c *gin.Context) {
	var product Product

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "details": err.Error()})
		return
	}

	// Generate slug and SKU
	product.Slug = GenerateSlug(product.Name)
	product.SKU = GenerateSKU(product.Name, product.Brand)

	// Validate product fields
	if err := pc.validate.Struct(&product); err != nil {
		var errorMessages []map[string]string
		for _, e := range err.(validator.ValidationErrors) {
			errorMessages = append(errorMessages, map[string]string{
				"field":   e.Field(),
				"message": fmt.Sprintf("The %s field is %s", e.Field(), e.Tag()),
			})
		}
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid input data",
			"errors":  errorMessages,
		})
		return
	}

	// Save to DB
	newProduct := models.Product{
		Name:        product.Name,
		Slug:        product.Slug,
		Description: product.Description,
		Price:       product.Price,
		Brand:       product.Brand,
		CategoryID:  product.CategoryID,
		Discount:    product.Discount,
		Stock:       product.Stock,
		SKU:         product.SKU,
		Status:      product.Status,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if err := pc.productService.CreateProduct(&newProduct); err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Product with the same name already exists"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"status": "success", "message": "Product created successfully", "product": newProduct})
}

func GenerateSlug(name string) string {
	return strings.ToLower(strings.ReplaceAll(name, " ", "-"))
}

func GenerateSKU(name, brand string) string {
	brandCode := strings.ToUpper(string([]rune(brand)[:3]))
	nameCode := strings.ToUpper(string([]rune(name)[:3]))

	rand.Seed(time.Now().UnixNano())
	alphabet := "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	suffix := make([]byte, 4)
	for i := 0; i < 4; i++ {
		suffix[i] = alphabet[rand.Intn(len(alphabet))]
	}

	return fmt.Sprintf("%s-%s-%s", brandCode, nameCode, string(suffix))
}

func (pc *ProductController) GetProduct(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	product, err := pc.productService.GetProduct(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": product})
}

func (pc *ProductController) GetAllProducts(c *gin.Context) {
	products, err := pc.productService.GetAllProducts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": products})
}

func (pc *ProductController) UpdateProduct(c *gin.Context) {
	var product Product

	// Convert ID from URL parameter
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "details": err.Error()})
		return
	}

	product.CategoryID = uint64(product.CategoryID)

	// Generate slug and SKU
	product.Slug = GenerateSlug(product.Name)
	product.SKU = GenerateSKU(product.Name, product.Brand)

	// Validate product fields
	if err := pc.validate.Struct(&product); err != nil {
		var errorMessages []map[string]string
		for _, e := range err.(validator.ValidationErrors) {
			errorMessages = append(errorMessages, map[string]string{
				"field":   e.Field(),
				"message": fmt.Sprintf("The %s field is %s", e.Field(), e.Tag()),
			})
		}
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid input data",
			"errors":  errorMessages,
		})
		return
	}

	// Prepare updated product
	newProduct := models.Product{
		Name:        product.Name,
		Slug:        product.Slug,
		Description: product.Description,
		Price:       product.Price,
		Brand:       product.Brand,
		CategoryID:  product.CategoryID,
		Discount:    product.Discount,
		Stock:       product.Stock,
		SKU:         product.SKU,
		Status:      product.Status,
		UpdatedAt:   time.Now(),
	}

	if err := pc.productService.UpdateProduct(uint(id), &newProduct); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product updated successfully"})
}

func (pc *ProductController) DeleteProduct(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	if err := pc.productService.DeleteProduct(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}
