package models

import (
	"time"

	"gorm.io/gorm"
)

type Order struct {
	ID            uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID        uint64         `gorm:"not null" json:"user_id"`
	TotalAmount   float64        `gorm:"type:decimal(10,2);not null" json:"total_amount"`
	Status        string         `gorm:"type:varchar(50);default:'pending'" json:"status"`         // "pending", "confirmed", "shipped", "delivered"
	PaymentMethod string         `gorm:"type:varchar(50);not null" json:"payment_method"`          // "COD" or "Online"
	PaymentID     *string        `gorm:"type:varchar(100);unique" json:"payment_id,omitempty"`     // Store transaction ID (if online)
	PaymentStatus string         `gorm:"type:varchar(50);default:'pending'" json:"payment_status"` // "pending", "paid", "failed"
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`

	OrderItems []OrderItem `gorm:"foreignKey:OrderID" json:"order_items"`
}

type OrderItem struct {
	ID        uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	OrderID   uint64         `gorm:"not null;index" json:"order_id"`
	ProductID uint64         `gorm:"not null;index" json:"product_id"`
	Quantity  int            `gorm:"not null" json:"quantity"`
	Price     float64        `gorm:"type:decimal(10,2);not null" json:"price"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (Order) TableName() string {
	return "orders"
}

func (OrderItem) TableName() string {
	return "order_items"
}

// // Create a new order
// order := Order{
//     UserID:        1,
//     TotalAmount:   100.00,
//     Status:        "pending",
//     PaymentMethod: "Online",
//     PaymentStatus: "pending",
//     OrderItems: []OrderItem{
//         {
//             ProductID: 101,
//             Quantity:  2,
//             Price:     50.00,
//         },
//         {
//             ProductID: 102,
//             Quantity:  1,
//             Price:     30.00,
//         },
//     },
// }

// // Save the order to the database
// db.Create(&order)

// // Query orders with their items
// var orders []Order
// db.Preload("OrderItems").Find(&orders)
