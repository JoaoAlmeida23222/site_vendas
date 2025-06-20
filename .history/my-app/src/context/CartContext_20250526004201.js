import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token && token !== 'undefined';

  // ✅ Memoized fetchCart to avoid warnings
  const fetchCart = useCallback(async () => {
    try {
      const response = await axios.get('/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  }, [token]);

  // ✅ Load cart on mount
  useEffect(() => {
    const loadCart = async () => {
      if (isLoggedIn) {
        await fetchCart();
      } else {
        const localCart = JSON.parse(localStorage.getItem('guest_cart')) || [];
        setCartItems(localCart);
      }
    };

    loadCart();
  }, [isLoggedIn, fetchCart]);

  // ✅ Save to localStorage if guest
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoggedIn]);

  // ...rest of your cart functions (addToCart, removeFromCart, etc.)
  // (no need to repeat them here unless you want full version again)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        clearCartCompletely,
        fetchCart,
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
