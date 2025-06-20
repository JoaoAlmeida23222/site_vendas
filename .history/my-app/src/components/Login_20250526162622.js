import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

import './Login.css';
import Navbar from './Navbar';

const Login = ({ onLogin = () => {} }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    try {
      const response = await axios.post("/api/auth/login", { email, password, rememberMe });
      const token = response.data.token;
      const user = response.data.user;
  
      if (token) {
        localStorage.setItem("token", token);
        window.dispatchEvent(new Event('storage'));

        localStorage.setItem("user", JSON.stringify(user));
  
        const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];

        const backendCartRes = await axios.get("/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const backendCart = backendCartRes.data;
        
        // ✅ Only sync if backend is empty
        if (guestCart.length > 0 && backendCart.length === 0) {
          await axios.post("/api/cart/sync", {
            items: guestCart,
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });
        
          localStorage.removeItem("guest_cart");
        }
  
        onLogin();
        navigate('/products');

      } else {
        setError("Login failed: no token returned.");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleGoogleLoginSuccess = async (credentialResponse) => {
  try {
    const res = await axios.post('http://localhost:5001/api/auth/google', {
      token: credentialResponse.credential  // ✅ This is the Google token
    });

    const token = res.data.token;
    const user = res.data.user;
    
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("storage")); // ✅ to notify context
    
      onLogin();
      navigate('/products');
    }
  } catch (err) {
    setError("Google login failed.");
    console.error("Google login error:", err);
  }
};


  return (
    <div className="login-container">
      <Navbar />
      <div className="login-card">
        <button className="close-button" onClick={() => navigate('/')}>×</button>
        <h2>Welcome Back</h2>
        <p className="subtitle">Please enter your details to sign in</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="/forgot-password" className="forgot-password">Forgot password?</a>
          </div>

          <button type="submit" disabled={isLoading} className="login-button">
            {isLoading ? "Signing in..." : "Sign in"}
          </button>

          {error && <p className="error-message">{error}</p>}

          <div className="google-login">
            <p className="subtitle">Or sign in with</p>
            <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={() => setError("Google Sign-in Failed")} />
          </div>

          <p className="register-link">
            Don't have an account? <a href="/register" className="register-link-text">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
