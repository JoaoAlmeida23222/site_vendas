import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token && token !== 'undefined';

  // ✅ Load cart from appropriate source on mount
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
  }, [isLoggedIn]);
  // ✅ Save guest cart to localStorage when updated
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoggedIn]);

  // 🧍‍♂️ Logged-in users only
  const fetchCart = async () => {
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
  };

  const addToCart = async (product) => {
    if (isLoggedIn) {
      try {
        await axios.post(
          '/api/cart/add',
          { productId: product.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await fetchCart();
      } catch (error) {
        console.error('Failed to add to cart:', error);
      }
    } else {
      const existing = cartItems.find((item) => item.id === product.id);
      if (existing) {
        setCartItems(
          cartItems.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      } else {
        setCartItems([...cartItems, { ...product, quantity: 1 }]);
      }
    }
  };

  const decreaseQuantity = async (productId) => {
    const updatedCart = cartItems
      .map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCartItems(updatedCart);

    if (isLoggedIn) {
      try {
        await axios.post(
          '/api/cart/sync',
          { items: updatedCart },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error('Failed to sync cart after decreasing quantity:', err);
      }
    }
  };

  const removeFromCart = async (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCart);

    if (isLoggedIn) {
      try {
        await axios.post(
          '/api/cart/sync',
          { items: updatedCart },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error('Failed to sync cart after removing item:', err);
      }
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('guest_cart');
  };

  const clearCartCompletely = async () => {
    setCartItems([]);
    localStorage.removeItem('guest_cart');

    if (isLoggedIn) {
      try {
        await axios.delete('/api/cart/clear', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error('Failed to clear cart on backend:', err);
      }
    }
  };

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
