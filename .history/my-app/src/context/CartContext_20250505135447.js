import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();
const [cartItems, setCartItems] = useState([]);
const [cart, setCart] = useState([]);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ Fetch cart from backend
  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get('/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCartItems(response.data); // response.data should be an array of items
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  useEffect(() => {
    fetchCart(); // Load cart on mount
  }, []);

  const addToCart = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // 🔥 Tell backend to add product
      await axios.post('/api/cart/add', 
        { productId: product.id }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Re-fetch updated cart from server
      await fetchCart();
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const decreaseQuantity = (productId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const clearCart = async () => {
    setCart([]);
  
    try {
      const token = localStorage.getItem("token");
      await axios.delete("/api/cart/clear", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Failed to clear cart on backend:", err);
    }
  
    localStorage.removeItem("cart");
  };
  

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
