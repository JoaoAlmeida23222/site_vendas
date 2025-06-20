import React, { createContext, useState, useContext} from 'react';
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

  //useEffect(() => {
    //fetchCart(); // Load cart on mount
  //}, []);

  const addToCart = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    try {
      // 🔥 Add 1 of the item on the backend
      await axios.post('/api/cart/add', 
        { productId: product.id }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // ✅ Fetch updated cart from backend
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

 const clearCart = () => {
  console.log('[CartContext] clearCart called'); // ✅ helps debug
  setCartItems([]); // ✅ only resets the UI
  
  // Clears frontend + backend (used by a "Clear Cart" button)
  const clearCartCompletely = async () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  
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
  };
  

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
