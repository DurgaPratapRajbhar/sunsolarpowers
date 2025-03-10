package repository

import (
	"project/product-api/models"
	"project/product-api/repository"

	"gorm.io/gorm"
)

type productRepository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) repository.ProductRepository {
	return &productRepository{db: db}
}

func (r *productRepository) CreateProduct(product *models.Product) error {
	return r.db.Create(product).Error
}

func (r *productRepository) GetProduct(id uint) (*models.Product, error) {
	var product models.Product
	err := r.db.Preload("Category").First(&product, id).Error
	return &product, err
}

// func (r *productRepository) UpdateProduct(id uint, product *models.Product) error {

// 	fmt.Println("product", product, "productproductproduct")
// 	return r.db.Preload("Category").Where("id = ?", id).Updates(&product).Error
// }

func (r *productRepository) UpdateProduct(id uint, product *models.Product) error {
	existingProduct := &models.Product{}
	if err := r.db.First(existingProduct, id).Error; err != nil {
		return err // Return an error if product is not found
	}
	return r.db.Model(existingProduct).Updates(product).Error
}

func (r *productRepository) DeleteProduct(id uint) error {
	return r.db.Delete(&models.Product{}, id).Error
}

func (r *productRepository) GetAllProducts() ([]models.Product, error) {
	var products []models.Product
	err := r.db.Preload("Category").Find(&products).Error
	return products, err
}
