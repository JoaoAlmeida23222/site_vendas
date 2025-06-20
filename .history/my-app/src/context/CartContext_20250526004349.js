import React, { createContext, useState, useContext} from 'react';
import axios from 'axios';

const CartContext = createContext();


export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ Fetch cart from backend
  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined') return;

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

  //useEffect(() => {
    //fetchCart(); // Load cart on mount
  //}, []);

 
  

  return (
    <CartContext.Provider
  value={{
    cartItems,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,             // for logout
    clearCartCompletely,   // for cart page
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
