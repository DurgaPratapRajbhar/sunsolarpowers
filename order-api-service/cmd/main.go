package main

import (
	"log"
	"os"
	"project/logging-service/logger"
	"project/order-api-service/database"
	"project/order-api-service/routes"
	config "project/shared/config"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	logger.Init("admin-oredr")

	config := config.LoadConfig()

	db, err := database.InitDB(config.Database.OrderDB)
	if err != nil {
		logger.Logger.Info("Error initializing database. Please check your database configuration.")
		os.Exit(1)
	}
	database.Migrate(db)

	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()
	r.RemoveExtraSlash = true
	r.RedirectTrailingSlash = false
	r.RedirectFixedPath = false

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			config.BaseUrl,
			config.BaseUrl + ":" + config.AdminFrontendPort,
			config.BaseUrl + ":" + config.FrontendPort,
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	err = r.SetTrustedProxies([]string{config.BaseUrlIP, "0.0.0.0/0"})
	if err != nil {
		log.Fatalf("Failed to set trusted proxies: %v", err)
	}

	routes.SetupRoutes(r, db)
	port := ":" + config.OrderPort

	if err := r.Run(port); err != nil {
		logger.Logger.Fatalf("Error starting server: %v", err)
	}
}
