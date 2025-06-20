import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext'; // ✅ use CartContext
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  
  

  const { cartItems, fetchCart, clearCart } = useCart();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsLoggedIn(true);
        setIsAdmin(decoded.role === 'admin');
        fetchCart(); // ✅ fetch cart on login
      } catch (error) {
        console.error('Failed to decode token:', error);
        localStorage.removeItem('token');
      }
    }
  }, [fetchCart]);

  // 🛒 Pulse animation when cartItems change
  useEffect(() => {
    if (cartItems.length > 0) {
      setCartPulse(true);
      const timeout = setTimeout(() => setCartPulse(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [cartItems]);

  const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleLogout = async () => {
    try {
      clearCart(); // ✅ this clears the UI/cart badge
  
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setIsAdmin(false);
      navigate('/');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };
  

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">
          <img src="/images/gearfit-logo.png" alt="GearFit Logo" className="logo-img" />
        </Link>
      </div>

      <div className="nav-links">
        <Link to="/products">Products</Link>
        <Link to="/sobre">About</Link>
        <Link to="/contato">Contact</Link>
        {isAdmin && (
          <Link to="/admin" className="admin-link">
            Admin Dashboard
          </Link>
        )}

        {/* 🛒 Cart Icon */}
        {totalQuantity > 0 ? (
          <Link to="/cart" className={`cart-link ${cartPulse ? 'pulse' : ''}`}>
            <FaShoppingCart />
            <span className="cart-count">{totalQuantity}</span>
          </Link>
        ) : (
          <div
            className={`cart-link disabled ${cartPulse ? 'shake' : ''}`}
            title="Your cart is empty"
            onClick={() => {
              setCartPulse(true);
              setTimeout(() => setCartPulse(false), 500);
            }}
          >
            <FaShoppingCart />
          </div>
        )}
      </div>

      <div className="nav-auth">
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="profile-link">Profile</Link>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-button">Login</Link>
            <Link to="/register" className="register-button">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
