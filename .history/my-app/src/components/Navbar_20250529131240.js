import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart, fetchCart } = useCart();
  const [cartPulse, setCartPulse] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // NEW

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    }
  }, [fetchCart]);

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
    clearCart();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('guest_cart');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
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
    <div
      className={`hamburger ${isMenuOpen ? 'open' : ''}`}
      onClick={() => setIsMenuOpen(!isMenuOpen)}
    >
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>

  {/* DROPDOWN MENU */}
  <div className={`nav-menu-wrapper ${isMenuOpen ? 'active' : ''}`}>
    <div className="nav-links">
      <Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link>
      <Link to="/sobre" onClick={() => setIsMenuOpen(false)}>About</Link>
      <Link to="/contato" onClick={() => setIsMenuOpen(false)}>Contact</Link>
      {isAdmin && (
        <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
      )}
      {totalQuantity > 0 ? (
        <Link to="/cart" className={`cart-link ${cartPulse ? 'pulse' : ''}`} onClick={() => setIsMenuOpen(false)}>
          <FaShoppingCart />
          <span className="cart-count">{totalQuantity}</span>
        </Link>
      ) : (
        <div className="cart-link disabled">
          <FaShoppingCart />
        </div>
      )}
    </div>

    <div className="nav-auth">
      {isLoggedIn ? (
        <>
          <Link to="/profile" className="profile-link" onClick={() => setIsMenuOpen(false)}>Profile</Link>
          <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="logout-button">Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" className="login-button" onClick={() => setIsMenuOpen(false)}>Login</Link>
          <Link to="/register" className="register-button" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
        </>
      )}
    </div>
  </div>
</nav>
  );
};

export default Navbar;
