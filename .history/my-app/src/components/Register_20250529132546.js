import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';
import Navbar from '../components/Navbar';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  adminCode: '',
  avatarFile: null,// 👈 NEW
});
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : (files ? files[0] : value)
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('email', formData.email);
      formPayload.append('password', formData.password);
      formPayload.append('adminCode', formData.adminCode || '');
      if (formData.avatarFile) {
        formPayload.append('file', formData.avatarFile); // 🔥 actual file, not name
      }
  
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        body: formPayload, // 🔥 do NOT set Content-Type
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }
  
      const token = data.token;
      const user = data.user;
  
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      window.dispatchEvent(new Event("storage"));
  
      const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
  
      const backendCartRes = await axios.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const backendCart = backendCartRes.data;
  
      if (guestCart.length > 0 && backendCart.length === 0) {
        await axios.post("/api/cart/sync", {
          items: guestCart,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        localStorage.removeItem("guest_cart");
      }
  
      navigate('/profile');
    } catch (err) {
      console.error('Register error:', err);
      setError('Registration failed');
    }
  };
  

  return (
    <div className="register-page">
    <Navbar />

    <div className="register-content">
      <div className="register-container">
        <div className="register-box">
          <button className="close-button" onClick={() => navigate('/')}>×</button>
          <h2>Create Account</h2>
          <p>Please fill in your information to get started</p>

          

          <form className="register-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>

            <div className="form-group">
  <label htmlFor="avatar">Upload Avatar</label>
  <input
    type="file"
    id="avatar"
    name="avatarFile"
    accept="image/*"
    onChange={handleChange}
  />
</div>


            <div className="form-group">
              <label htmlFor="adminCode">Admin Code (Optional)</label>
              <input
                type="text"
                id="adminCode"
                name="adminCode"
                value={formData.adminCode}
                onChange={handleChange}
                placeholder="Enter invite code if you have one"
              />
            </div>

            <button type="submit" className="register-button">
              CREATE ACCOUNT
            </button>

            <p className="login-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
