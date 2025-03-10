package controllers

import (
	"net/http"
	"project/user-service-api/services"

	"project/user-service-api/models"

	"github.com/gin-gonic/gin"
)

type PermissionController struct {
	service services.PermissionServices
}

func NewPermissionController(service services.PermissionServices) *PermissionController {

	return &PermissionController{service: service}
}

func (pc *PermissionController) CreatePermission(c *gin.Context) {
	var permission models.Permission
	if err := c.ShouldBindJSON(&permission); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := pc.service.CreatePermission(&permission); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create permission"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Permission created successfully", "data": permission})
}

func (pc *PermissionController) GetAllPermissions(c *gin.Context) {
	permissions, err := pc.service.GetAllPermission()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch permissions"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": permissions})
}
