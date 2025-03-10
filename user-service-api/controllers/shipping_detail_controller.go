package controllers

import (
	"net/http"
	"strconv"

	"project/user-service-api/models"
	"project/user-service-api/services"

	"github.com/gin-gonic/gin"
)

type ShippingDetailController struct {
	ShippingDetailService services.ShippingDetailsService
}

func NewShippingDetailController(ShippingDetailService services.ShippingDetailsService) *ShippingDetailController {
	return &ShippingDetailController{ShippingDetailService: ShippingDetailService}
}

func (uc *ShippingDetailController) CreateShippingDetail(c *gin.Context) {
	var ShippingDetail models.ShippingDetail

	if err := c.ShouldBindJSON(&ShippingDetail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := uc.ShippingDetailService.CreateShippingDetail(&ShippingDetail); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create ShippingDetail"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "ShippingDetail created successfully", "data": ShippingDetail})
}

func (uc *ShippingDetailController) GetShippingDetail(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ShippingDetail ID"})
		return
	}

	ShippingDetail, err := uc.ShippingDetailService.GetShippingDetail(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ShippingDetail not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": ShippingDetail})
}

func (uc *ShippingDetailController) GetAllShippingDetails(c *gin.Context) {
	ShippingDetails, err := uc.ShippingDetailService.GetAllShippingDetail()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch ShippingDetails"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": ShippingDetails})
}

func (uc *ShippingDetailController) UpdateShippingDetail(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ShippingDetail ID"})
		return
	}

	var ShippingDetail models.ShippingDetail
	if err := c.ShouldBindJSON(&ShippingDetail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := uc.ShippingDetailService.UpdateShippingDetail(uint(id), &ShippingDetail); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update ShippingDetail"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ShippingDetail updated successfully"})
}

func (uc *ShippingDetailController) DeleteShippingDetail(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ShippingDetail ID"})
		return
	}

	if err := uc.ShippingDetailService.DeleteShippingDetail(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete ShippingDetail"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ShippingDetail deleted successfully"})
}
