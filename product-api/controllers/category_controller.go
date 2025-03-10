package controllers

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"project/product-api/models"
	"project/product-api/services"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type CategoryController struct {
	categoryService services.CategoryService
}

func NewCategoryController(categoryService services.CategoryService) *CategoryController {
	return &CategoryController{categoryService: categoryService}
}

func (cc *CategoryController) CreateCategory(c *gin.Context) {
	// Extract form fields
	name := c.PostForm("name")
	slug := c.PostForm("slug")
	parentID := c.DefaultPostForm("parent_id", "0")
	description := c.PostForm("description")
	status := c.PostForm("status")

	// Convert parentID to uint64
	parent_id, err := strconv.ParseUint(parentID, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid parent_id value"})
		return
	}

	// File handling
	file, err := c.FormFile("image")
	var imageFileName string
	if err == nil && file != nil {
		err := c.SaveUploadedFile(file, "../../image_gallery/categories/"+file.Filename)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to save image"})
			return
		}
		imageFileName = file.Filename
	}

	// Initialize Category
	category := models.Category{
		Name:        name,
		Slug:        slug,
		ParentID:    parent_id,
		Description: description,
		Status:      status,
	}

	// Validation
	validate := validator.New()
	if err := validate.Struct(&category); err != nil {
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
			"error":   errorMessages,
		})
		return
	}

	// Check if categoryService is not nil
	if cc.categoryService == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Category service is not initialized"})
		return
	}

	category.Image = imageFileName
	if err := cc.categoryService.CreateCategory(&category); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create category"})
		return
	}

	// Successful response
	c.JSON(http.StatusCreated, gin.H{
		"status":  "success",
		"message": "Category created successfully",
		"data":    category,
	})
}

func (cc *CategoryController) GetCategory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	category, err := cc.categoryService.GetCategory(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": category})
}

func (cc *CategoryController) GetAllCategories(c *gin.Context) {
	categories, err := cc.categoryService.GetAllCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}

	fmt.Println(categories)

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": categories})
}

func (cc *CategoryController) GetAllCategoriesList(c *gin.Context) {
	categories, err := cc.categoryService.GetAllCategoriesList()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}

	fmt.Println(categories)

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": categories})
}

func (cc *CategoryController) UpdateCategory(c *gin.Context) {

	cat_id := c.Param("id")
	id, err := strconv.ParseUint(cat_id, 10, 64)
	if err != nil || id == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	name := c.PostForm("name")
	slug := c.PostForm("slug")

	parent_id, err := strconv.ParseUint(c.PostForm("parent_id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid parent id"})
		return
	}

	description := c.PostForm("description")
	status := c.PostForm("status")
	file, err := c.FormFile("image")

	var imageFileName string
	if err == nil && file != nil {
		ext := getFileExtension(file.Filename)
		imageFileName = "categories/" + slug + ext

		err := c.SaveUploadedFile(file, "../../image_gallery/"+imageFileName)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to save image"})
			return
		}

	}

	category := models.Category{
		Name:        name,
		Slug:        slug,
		ParentID:    parent_id,
		Description: description,
		Status:      status,
	}

	validate := validator.New()
	if err := validate.Struct(&category); err != nil {
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
			"error":   errorMessages,
		})
		return
	}

	category.Image = imageFileName
	err = cc.categoryService.UpdateCategory(uint(id), &category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to Update category"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status":  "success",
		"message": "Category Updated successfully",
		"data":    category,
	})

}

func (cc *CategoryController) DeleteCategory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	if err := cc.categoryService.DeleteCategory(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete category"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Category deleted successfully"})
}
func getFileExtension(filename string) string {
	dotIndex := strings.LastIndex(filename, ".")
	if dotIndex == -1 {
		return ""
	}
	return filename[dotIndex:]
}
