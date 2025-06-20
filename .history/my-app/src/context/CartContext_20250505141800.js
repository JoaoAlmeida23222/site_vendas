import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();


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
    // ✅ Tell backend to add ONE unit of this product
    await axios.post('/api/cart/add', 
      { productId: product.id }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // ✅ Then re-fetch the cart to update UI
    await fetchCart();
  } catch (error) {
    console.error('Failed to add to cart:', error);
  }
};

  const decreaseQuantity = async (productId) => {
    const updatedCart = cartItems.map(item =>
      item.id === productId
        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        : item
    );
  
    setCartItems(updatedCart);
  
    try {
      const token = localStorage.getItem("token");
      await axios.post('/api/cart/sync', 
        { items: updatedCart },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to sync cart after decreasing quantity:", err);
    }
  };

 const removeFromCart = async (productId) => {
  const updatedCart = cartItems.filter(item => item.id !== productId);
  setCartItems(updatedCart);

  try {
    const token = localStorage.getItem("token");
    await axios.post('/api/cart/sync', 
      { items: updatedCart }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err) {
    console.error("Failed to sync cart after removing item:", err);
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
