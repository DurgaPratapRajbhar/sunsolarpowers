package controllers

import (
	"net/http"
	"project/shared/jwt"
	"project/user-service-api/services"

	"github.com/gin-gonic/gin"
)

type LoginController struct {
	service services.Loginservice
}

func NewLoginController(service services.Loginservice) *LoginController {
	return &LoginController{service: service}
}

func (s *LoginController) UserLogin(c *gin.Context) {
	var req struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	permission, err := s.service.UserLogin(req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	c.SetCookie("access_token", permission.Token, 3600, "/", "localhost", false, true)

	c.JSON(http.StatusOK, gin.H{"message": "Login successful", "data": permission})
}

func (s *LoginController) Me(c *gin.Context) {
	tokenString, err := c.Cookie("access_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// ✅ Token validate karo (Correct way)
	claims, err := jwt.ValidateToken(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	// ✅ Return user data from JWT claims
	c.JSON(http.StatusOK, gin.H{
		"id":    claims.UserID,
		"email": claims.Email,
	})
}

func (s *LoginController) Logout(c *gin.Context) {
	c.SetCookie("access_token", "", -1, "/", "localhost", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out"})
}
