"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, AlertCircle, Loader2, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_ROOT;
const FALLBACK_IMAGE = "/images/default.jpg";

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    const URL = `${process.env.NEXT_PUBLIC_PRODUCT_API_ROOT}/v1/product/${slug}`;

    async function fetchProductDetails() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(URL);

        if (!response.ok) {
          throw new Error(`Failed to fetch product (${response.status})`);
        }

        const responseData = await response.json();

        if (isMounted) {
          if (responseData && responseData.status === "success" && responseData.data && responseData.data.length > 0) {
            const productData = responseData.data[0]; // Access the first item in the data array
            
          
            if (productData.images && productData.images.length > 0) {
              const primaryIndex = productData.images.findIndex(img => img.is_primary);
              if (primaryIndex !== -1) {
                setCurrentImageIndex(primaryIndex);
              }
            }
            
            setProduct(productData);
          } else {
            throw new Error(responseData.message || "Failed to retrieve product");
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching product:", error);
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProductDetails();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const nextSlide = () => {
    if (!product || !product.images || product.images.length === 0) return;
    setCurrentImageIndex(prevIndex => 
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    if (!product || !product.images || product.images.length === 0) return;
    setCurrentImageIndex(prevIndex => 
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentImageIndex(index);
  };

  const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return (price - (price * discount / 100)).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        <AlertCircle className="inline-block w-6 h-6" /> {error}
      </div>
    );
  }

  if (!product) {
    return <p className="text-center mt-10">No product found.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <button 
        onClick={() => router.back()} 
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to products

         
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {/* Image Slider */}
          <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
            {product.images && product.images.length > 0 ? (

              <>
              
                <Image
                  src={`${IMAGE_URL}${product.images[currentImageIndex].image_url}`}
                  alt={product.images[currentImageIndex].alt_text || product.name}
                  fill
                   sizes="(max-width: 768px) 25vw, (max-width: 1200px) 15vw, 10vw"
                  className="object-contain"
                />
                
                {/* Navigation Arrows */}
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <button 
                    onClick={prevSlide} 
                    className="bg-white bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 focus:outline-none"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button 
                    onClick={nextSlide} 
                    className="bg-white bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 focus:outline-none"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </div>
              </>
            ) : (
              <Image
                src={FALLBACK_IMAGE}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 25vw, (max-width: 1200px) 15vw, 10vw"
                className="object-contain"
              />
            )}
          </div>
          
          {/* Thumbnail Indicators */}
          {product.images && product.images.length > 0 && (
            <div className="flex justify-center space-x-2 mt-4">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
          
          {/* Thumbnail Preview */}
          {product.images && product.images.length > 0 && (
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {product.images.map((image, index) => (
                <div 
                  key={image.id} 
                  className={`relative flex-shrink-0 w-20 h-20 border-2 rounded cursor-pointer ${
                    currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  onClick={() => goToSlide(index)}
                >
                  <Image
                    src={`${IMAGE_URL}${image.image_url}`}
                    alt={image.alt_text || product.name}
                    fill
                    className="object-cover object-center rounded"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
            <p className="text-sm text-gray-500">Brand: {product.brand}</p>
          </div>
          
          <div className="border-t border-b py-4">
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          <div>
            {product.discount > 0 ? (
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-red-600">
                ₹{calculateDiscountedPrice(product.price, product.discount)}
                </p>
                <p className="text-lg text-gray-500 line-through">${product.price}</p>
                <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                  {product.discount}% OFF
                </span>
              </div>
            ) : (
              <p className="text-2xl font-bold">${product.price}</p>
            )}
          </div>
          
          <div className="flex items-center">
            <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${product.stock > 0 ? 'bg-green-600' : 'bg-red-600'}`}></span>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </p>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex gap-4">
              <button 
              onClick={() => router.push('/cart')}
                className={`${product.stock > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white px-6 py-3 rounded-lg flex items-center transition-colors`}
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
              </button>
              <button   className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg flex items-center transition-colors">
                Buy Now
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>Status: <span className="capitalize">{product.status}</span></p>
            <p>Last Updated: {new Date(product.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}