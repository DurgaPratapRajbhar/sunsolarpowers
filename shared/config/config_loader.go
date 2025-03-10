package config

import (
	"log"
	"os"
	"path/filepath"
	"runtime"

	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

type Config struct {
	Database struct {
		Type      string `mapstructure:"type"`
		ProductDB string
		UserDB    string
		OrderDB   string
	} `mapstructure:"database"`

	AppEnv            string
	BaseUrl           string
	BaseUrlIP         string
	AdminFrontendPort string
	FrontendPort      string
	ProductPort       string
	UserPort          string
	OrderPort         string
	Image_gallery     string

	CookieDomain string
}

func LoadConfig() Config {
	var config Config

	// Get current directory of this file
	_, filename, _, ok := runtime.Caller(0)
	if !ok {
		log.Fatal("❌ Error getting file path")
	}
	basePath := filepath.Dir(filename)

	// Detect environment (default: "development")production
	config.AppEnv = getEnv("APP_ENV", "development")

	// Load .env file
	envFile := filepath.Join(basePath, ".env."+config.AppEnv)
	if err := godotenv.Load(envFile); err != nil {
		log.Printf("⚠ No .env file found at %s", envFile)
	}

	// Load YAML config
	viper.SetConfigFile(filepath.Join(basePath, "config.yaml"))
	viper.SetConfigType("yaml")

	if err := viper.ReadInConfig(); err != nil {
		log.Fatal("❌ Error reading config file:", err)
	}
	if err := viper.Unmarshal(&config); err != nil {
		log.Fatal("❌ Error unmarshalling config file:", err)
	}

	config.Database.ProductDB = getEnv("PRODUCT_DB_DSN", config.Database.ProductDB)
	config.Database.UserDB = getEnv("USER_DB_DSN", config.Database.UserDB)
	config.Database.OrderDB = getEnv("ORDER_DB_DSN", config.Database.OrderDB)
	config.BaseUrl = getEnv("BASE_URL", "BASE_URL")
	config.BaseUrlIP = getEnv("BASE_URL_IP", "BASE_URL_IP")
	config.AdminFrontendPort = getEnv("ADMIN_FRONTEND_PORT", "ADMIN_FRONTEND_PORT")
	config.FrontendPort = getEnv("FRONTEND_PORT", "FRONTEND_PORT")
	config.ProductPort = getEnv("PRODUCT_API_PORT", "PRODUCT_API_PORT")
	config.UserPort = getEnv("USER_SERVICE_API_PORT", "USER_SERVICE_API_PORT")
	config.OrderPort = getEnv("ORDER_SERVICE_API_PORT", "ORDER_SERVICE_API_PORT")

	config.Image_gallery = getEnv("IMAGE_PATH", "IMAGE_PATH")

	config.CookieDomain = getEnv("COOKIE_DOMAIN", "localhost")

	return config
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
