package impl

import (
	"project/user-service-api/models"
	"project/user-service-api/repository"

	"gorm.io/gorm"
)

type ShippingDetailsRepositoryImpl struct {
	db *gorm.DB
}

func NewShippingDetailsRepository(db *gorm.DB) repository.ShippingDetailsRepository {
	return &ShippingDetailsRepositoryImpl{db: db}
}

func (r *ShippingDetailsRepositoryImpl) Create(ShippingDetail *models.ShippingDetail) error {

	return r.db.Create(ShippingDetail).Error
}

func (r *ShippingDetailsRepositoryImpl) GetByID(id uint) (*models.ShippingDetail, error) {
	var ShippingDetail models.ShippingDetail
	err := r.db.First(&ShippingDetail, id).Error
	if err != nil {
		return nil, err
	}
	return &ShippingDetail, nil
}

func (r *ShippingDetailsRepositoryImpl) GetAll() ([]models.ShippingDetail, error) {
	var ShippingDetails []models.ShippingDetail
	err := r.db.Find(&ShippingDetails).Error
	if err != nil {
		return nil, err
	}
	return ShippingDetails, nil
}

func (r *ShippingDetailsRepositoryImpl) Update(id uint, ShippingDetail *models.ShippingDetail) error {

	return r.db.Model(&models.ShippingDetail{}).Where("id = ?", id).Updates(ShippingDetail).Error
}

func (r *ShippingDetailsRepositoryImpl) Delete(id uint) error {
	return r.db.Delete(&models.ShippingDetail{}, id).Error
}
