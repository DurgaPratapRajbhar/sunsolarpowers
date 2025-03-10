"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, AlertCircle, Loader2, Tag, ImageOff, Eye } from "lucide-react";
import { HTTP } from "../../../utils/http.js";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";

const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_ROOT;
const FALLBACK_IMAGE = "/images/placeholder-product.jpg";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();
  const router = useRouter();

  const { cart, getUserCart, addToCart } = useCart();
  const { user, setAuthPopupOpen } = useAuth();

  const resolvedSlug = slug || "solar-power-systems";

 

  useEffect(() => {
    if (!resolvedSlug) return; 
    
    let isMounted = true;
    const URL = `${process.env.NEXT_PUBLIC_PRODUCT_API_ROOT}/v1/category/${resolvedSlug}`;
  
    async function fetchProducts() {
      try {
        setIsLoading(true);
        setError(null);
  
        const response = await fetch(URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch products (${response.status})`);
        }
  
        const responseData = await response.json();
        if (isMounted) {
          if (responseData?.status === "success") {
            setProducts(responseData.data);
          } else {
            throw new Error(responseData.message || "Failed to retrieve products");
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching products:", error);
          setError(error.message);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
  
    fetchProducts();
    
    if (user?.id) {
      getUserCart(user.id);
    }
  
    return () => {
      isMounted = false;
    };
  }, [resolvedSlug, user]);
  
  // Navigate to product detail page
  const navigateToProduct = (productSlug) => {
    router.push(`/product/${productSlug}`);
  };

  // Calculate the discounted price
  const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return price - (price * (discount / 100));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
};


  // Truncate long descriptions
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const clickAddToCart = async (product) => {
    if (!user) {
      setAuthPopupOpen(true);
      return;
    }

    const Product = { user_id: user.id, product_id: product.id, quantity: 1 };
    await addToCart(Product);
    console.log("Updated Cart:", cart);
  };
  
  

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-red-700">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-yellow-700 mb-2">No Products Found</h2>
          <p className="text-gray-600">There are currently no products available in this category.</p>
        </div>
      </div>
    );
  }

  // Capitalize category name for display
  const categoryName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{categoryName}</h1>
        <p className="text-gray-500">{products.length} products found</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          const hasImage = product.primary_image != null;
          const productImage = hasImage ? `${IMAGE_URL}${product.primary_image}` : FALLBACK_IMAGE;
          
          const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
          const hasDiscount = product.discount > 0;
            
          return (
            <div 
              key={product.id} 
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => navigateToProduct(product.slug)}
            >
              <div className="relative h-48 bg-gray-100">
                {hasImage ? (
                  <Image
                    src={productImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200">
                    <div className="text-center text-gray-400">
                      <ImageOff className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">No image available</p>
                    </div>
                  </div>
                )}
                
                {hasDiscount && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {product.discount}% OFF
                  </span>
                )}
                
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Only {product.stock} left
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Out of stock
                  </span>
                )}
                
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white text-blue-500 rounded-full p-3 transform hover:scale-110 transition-transform duration-200">
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">{product.name}</h2>
                  {product.brand && (
                    <span className="text-xs text-gray-500 ml-2">{product.brand}</span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-3 h-10 line-clamp-2">{truncateText(product.description)}</p>
                
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <Tag className="h-3 w-3 mr-1" />
                  <span>SKU: {product.sku}</span>
                </div>
                
                <div className="flex justify-between items-end mt-4">
                  <div>
                    {hasDiscount ? (
                      <div className="flex flex-col">
                        <p className="text-xs text-gray-500 line-through">{formatPrice(product.price)}</p>
                        <p className="text-xl font-bold text-red-600">{formatPrice(discountedPrice)}</p>
                      </div>
                    ) : (
                      <p className="text-xl font-bold text-blue-600">{formatPrice(product.price)}</p>
                    )}
                  </div>
                  
                  <button 
                    className={`flex items-center rounded-full p-2 ${
                      product.stock > 0 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    } transition-colors duration-200`}
                    disabled={product.stock === 0}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the card click
                      clickAddToCart(product);
                    }}

                     

                  >
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}