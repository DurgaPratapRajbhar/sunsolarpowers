package impl

import (
	"project/user-service-api/models"
	"project/user-service-api/repository"
	"project/user-service-api/services"

	"golang.org/x/exp/rand"
)

type ShippingDetailsServiceImpl struct {
	repo repository.ShippingDetailsRepository
}

func NewShippingDetailService(repo repository.ShippingDetailsRepository) services.ShippingDetailsService {
	return &ShippingDetailsServiceImpl{repo: repo}
}

func (s *ShippingDetailsServiceImpl) CreateShippingDetail(ShippingDetail *models.ShippingDetail) error {

	trackingNumber := GenerateTrackingNumber()
	ShippingDetail.TrackingNumber = trackingNumber

	// for {
	// 	existing, _ := s.repo.GetByTrackingNumber(trackingNumber)
	// 	if existing == nil {
	// 		break
	// 	}
	// 	trackingNumber = GenerateTrackingNumber() // Retry if duplicate
	// }

	return s.repo.Create(ShippingDetail)
}

func (s *ShippingDetailsServiceImpl) GetShippingDetail(id uint) (*models.ShippingDetail, error) {
	return s.repo.GetByID(id)
}

func (s *ShippingDetailsServiceImpl) GetAllShippingDetail() ([]models.ShippingDetail, error) {
	return s.repo.GetAll()
}

func (s *ShippingDetailsServiceImpl) UpdateShippingDetail(id uint, ShippingDetail *models.ShippingDetail) error {
	return s.repo.Update(id, ShippingDetail)
}

func (s *ShippingDetailsServiceImpl) DeleteShippingDetail(id uint) error {
	return s.repo.Delete(id)
}

func GenerateTrackingNumber() string {
	// Generate a random alphanumeric tracking number
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, 10)
	for i := range b {
		b[i] = charset[rand.Intn(len(charset))]
	}
	return "TRK-" + string(b)
}
