"use client";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { HTTP } from "../../utils/http.js";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { cart, getUserCart, removeFromCart, updateCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState(null);
  const didFetch = useRef(false);

  const URL = `${process.env.NEXT_PUBLIC_PRODUCT_API_ROOT}`;
  const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_ROOT || "http://localhost:8080/image_gallery/";

  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.id || didFetch.current) return;
      try {
        setLoading(true);
        await getUserCart(user.id);
        didFetch.current = true;
      } catch (error) {
        setError(`Failed to load cart: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user, getUserCart]);

  useEffect(() => {
    
    setTotalAmount(
      Array.isArray(cart) && cart.length
        ? cart.reduce((sum, item) => sum + (Number(item.product?.price) || 0) * (Number(item.quantity) || 1), 0)
        : 0
    );
  }, [cart]);

  const handleRemoveItem = async (cartId) => {
    if (!user?.id) {
      setError("User not authenticated.");
      return;
    }
    try {
      await removeFromCart(cartId, user.id);
    } catch (error) {
       console.log(error)
      setError(`Failed to remove item: ${error.message || "Unknown error"}`);
    }
  };

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1 || !user?.id) return;
    try {
      await updateCart({ user_id: user.id, product_id: item.product.id, quantity: newQuantity }, item.id);
    } catch (error) {
      setError(`Failed to update quantity: ${error.message}`);
    }
  };

  const handleCheckout = async () => {
    if (!cart?.length) return;
    const orderData = {
      user_id: user.id,
      total_amount: totalAmount * 1.1,
      payment_method: "COD",
      items: cart.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
    };
    try {
      setLoading(true);
      await HTTP("POST", `${URL}orders/`, orderData, "");
      router.push("/checkout");
    } catch (error) {
      setError(`Failed to place order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
          <FaShoppingCart className="text-4xl mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="mb-6 text-gray-600">Sign in to view your cart</p>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h1>
        {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
 
        {cart?.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 bg-white rounded-lg shadow-md">
              {cart.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center p-4 ${index < cart.length - 1 ? "border-b" : ""}`}
                > 

        

                  <img
                    src={item.product.primary_image ? `${IMAGE_URL}${item.product.primary_image}` : ""}
                    alt={item.product.name}
                    className="w-20 h-20 object-contain rounded mb-4 sm:mb-0 sm:mr-4"
                    onError={(e) => (e.target.src = "/placeholder-product.jpg")} // Fallback if image fails
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{item.product.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{item.product.description}</p>
                    <p className="text-blue-600 font-medium mt-1">₹{Number(item.product.price).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <div className="flex items-center border rounded-md">
                      <button
                        className="p-2 hover:bg-gray-100 disabled:opacity-50"
                        onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus className="text-sm" />
                      </button>
                      <span className="px-4 py-1 min-w-[2.5rem] text-center">{item.quantity}</span>
                      <button
                        className="p-2 hover:bg-gray-100"
                        onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>
                    <button className="text-red-500 hover:text-red-600 p-2" onClick={() => handleRemoveItem(item.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
                <h3 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h3>
                <div className="space-y-4 text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span>₹{(totalAmount * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-800">
                    <span>Total</span>
                    <span>₹{(totalAmount * 1.1).toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Proceed to Checkout"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <FaShoppingCart className="text-4xl mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Cart is Empty</h2>
            <p className="mb-6 text-gray-600">Add some products to get started!</p>
            <Link href="/products" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}