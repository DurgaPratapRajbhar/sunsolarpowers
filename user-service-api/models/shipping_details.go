package models

import (
	"time"
)

type ShippingDetail struct {
	ID                uint      `gorm:"primaryKey" json:"id"`
	UserID            uint      `gorm:"not null" json:"user_id"`
	OrderID           *uint     `gorm:"not null" json:"order_id"` // ✅ Allow null values
	RecipientName     string    `gorm:"size:255;not null" json:"recipient_name"`
	PhoneNumber       string    `gorm:"size:20;not null" json:"phone_number"`
	AddressLine1      string    `gorm:"size:255;not null" json:"address_line1"`
	AddressLine2      string    `gorm:"size:255" json:"address_line2,omitempty"`
	City              string    `gorm:"size:100;not null" json:"city"`
	State             string    `gorm:"size:100;not null" json:"state"`
	PostalCode        string    `gorm:"size:20;not null" json:"postal_code"`
	Country           string    `gorm:"size:100;not null;default:'India'" json:"country"`
	TrackingNumber    string    `gorm:"size:50;unique" json:"tracking_number"`
	ShippingStatus    string    `gorm:"type:enum('Pending','Shipped','In Transit','Delivered','Cancelled');default:'Pending'" json:"shipping_status"`
	Carrier           string    `gorm:"size:100" json:"carrier"`
	EstimatedDelivery time.Time `json:"estimated_delivery"` // ✅ Allows null values
	CreatedAt         time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt         time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}
