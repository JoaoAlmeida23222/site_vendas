import React, { useEffect, useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  
  const { cartItems, clearCart, fetchCart } = useCart();
  const [cartPulse, setCartPulse] = useState(false);

  // ✅ Dynamic token & admin role detection (no useState needed)
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      isAdmin = decoded.role === 'admin';
    } catch (err) {
      console.error('Failed to decode token:', err);
    }
  }

  // ✅ Fetch cart when token becomes available (e.g., after login)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    }
  }, []); // ✅ only runs once when component mounts
   // optional: refetch on route change

  // ✅ Pulse effect on cart updates
  useEffect(() => {
    if (cartItems.length > 0) {
      setCartPulse(true);
      const timeout = setTimeout(() => setCartPulse(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [cartItems]);

  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const handleLogout = () => {
    clearCart(); // clears frontend cart
    localStorage.removeItem('token');
    navigate('/'); // go to homepage
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">
          <img
            src="/images/gearfit-logo.png"
            alt="GearFit Logo"
            className="logo-img"
          />
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
          <div className="cart-link disabled" title="Your cart is empty">
            <FaShoppingCart />
          </div>
        )}
      </div>

      <div className="nav-auth">
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="profile-link">
              Profile
            </Link>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-button">
              Login
            </Link>
            <Link to="/register" className="register-button">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
