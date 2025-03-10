"use client";
import { createContext, useContext, useState } from "react";
import { HTTP } from "../utils/http.js"; // Ensure this is the correct import

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const getUserCart = async (userId) => {  
     
    if (!userId) {
      // console.error("User ID is required to fetch the cart");
      return [];
    }

    const getUserCartDetails = `${process.env.NEXT_PUBLIC_PRODUCT_API_ROOT}cart/${userId}`;
    

    try {
      const response = await HTTP("GET", getUserCartDetails, {}, "");
      if (response?.status === "success") {
        setCart(response.data);
        return response.data;
      } else {
        console.error("Failed to fetch cart:", response?.error || "Unknown error");
        return [];
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      return [];
    }
  };

  const addToCart = async (product) => {
    if (!product || !product.user_id || !product.product_id) {
      console.error("Invalid product details");
      return;
    }
 
    const addToDatabase = `${process.env.NEXT_PUBLIC_PRODUCT_API_ROOT}/cart/`;
    try {
      const addResponse = await HTTP("POST", addToDatabase, product, "");
      await getUserCart(product.user_id);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const removeFromCart = async (cartID, userId) => {
   
    if (!userId) {
      console.error("User ID is required to remove from cart");
      return;
    }

    const removeCart = `${process.env.NEXT_PUBLIC_PRODUCT_API_ROOT}cart/${cartID}`;

    try {
      const response = await HTTP("DELETE", removeCart, {}, "");
      
        await getUserCart(userId);
        return response.data;
       
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateCart = async (product, cartID) => {
    if (!product || !product.user_id || !product.product_id) {
      console.error("Invalid product details");
      return;
    }
 
    
    const updateDatabase = `${process.env.NEXT_PUBLIC_PRODUCT_API_ROOT}cart/${cartID}`;
    try {
      const updateResponse = await HTTP("PUT", updateDatabase, product, "");
      await getUserCart(product.user_id);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      getUserCart, 
      addToCart,
      removeFromCart,
      updateCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider, CartContext };
export const useCart = () => useContext(CartContext);