package jwt

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Secret key for signing the JWT tokens
var secretKey = []byte("your-secret-key") // Use a strong secret key and store securely

// Claims struct defines the JWT claims
type Claims struct {
	UserID uint   `json:"user_id"`
	Email  string `json:"email"` // Add the email to the token
	jwt.RegisteredClaims
}

// GenerateToken generates a JWT token for the given user
func GenerateToken(userID uint, email string) (string, error) {
	// Set the expiration time of the token (e.g., 24 hours)
	expirationTime := time.Now().Add(24 * time.Hour)

	// Define the claims with the UserID, email, and expiration time
	claims := &Claims{
		UserID: userID,
		Email:  email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	// Create the JWT token with the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with the secret key
	signedToken, err := token.SignedString(secretKey)
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %v", err)
	}

	// Return the signed token
	return signedToken, nil
}
