package models

import "time"

type Role struct {
	ID          uint         `gorm:"primaryKey"`
	Name        string       `gorm:"size:50;unique;not null"`
	Permissions []Permission `gorm:"many2many:role_permissions;"`
	CreatedAt   time.Time    `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time    `gorm:"autoUpdateTime" json:"updated_at"`
}
