package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB) {
	CategoryRoutes(r, db)
	ProductRoutes(r, db)
	ImageRoutes(r, db)
	RrontendRoutes(r, db)
	CartRoutes(r, db)
	ReviewRoutes(r, db)
	VariantRoutes(r, db)
	OrderRoutes(r, db)
}
