import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // ✅ CORRECTED HERE
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token); // ✅ now works correctly
        setIsLoggedIn(true);
        setIsAdmin(decoded.role === 'admin');
      } catch (error) {
        console.error('Failed to decode token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">GYM STORE</Link>
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
      </div>

      <div className="nav-auth">
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="profile-link">Profile</Link>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
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
