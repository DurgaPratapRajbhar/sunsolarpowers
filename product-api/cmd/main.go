package main

import (
	"fmt"
	"log"
	"os"
	"project/logging-service/logger"
	"project/product-api/database"
	"project/product-api/routes"
	config "project/shared/config"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	logger.Init("admin-api-main")

	config := config.LoadConfig()

	db, err := database.InitDB(config.Database.ProductDB)
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

	fmt.Println(config.BaseUrl+":"+config.AdminFrontendPort, config.BaseUrl+":"+config.FrontendPort, config.ProductPort)

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			config.BaseUrl,
			config.BaseUrl + ":" + config.AdminFrontendPort,
			config.BaseUrl + ":" + config.FrontendPort,
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	err = r.SetTrustedProxies([]string{config.BaseUrlIP, "0.0.0.0/0"})
	if err != nil {
		log.Fatalf("Failed to set trusted proxies: %v", err)
	}

	//fmt.Println(config.Image_gallery)

	r.Static("/image_gallery", config.Image_gallery)

	r.Use(gin.Recovery())
	routes.SetupRoutes(r, db)

	port := ":" + config.ProductPort
	if err := r.Run(port); err != nil {
		logger.Logger.Fatalf("Error starting server: %v", err)
	}
}
