package main

import (
	"log"
	"os"
	"project/logging-service/logger"
	"project/shared/config"
	"project/user-service-api/database"
	"project/user-service-api/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	logger.Init("admin-api-main")

	config := config.LoadConfig()

	db, err := database.InitDB(config.Database.UserDB)
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
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length", "Set-Cookie"},
		AllowCredentials: true,
	}))

	err = r.SetTrustedProxies(nil)
	if err != nil {
		log.Fatalf("Failed to set trusted proxies: %v", err)
	}

	routes.SetupRoutes(r, db)
	port := ":" + config.UserPort

	if err := r.Run(port); err != nil {
		logger.Logger.Fatalf("Error starting server: %v", err)
	}
}
