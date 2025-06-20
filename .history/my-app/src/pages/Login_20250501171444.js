import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import Navbar from '../components/Navbar';

const Login = () => {
  return (
    
    <div className="login-page">
      <Navbar />

      
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtext">Sign in to continue your journey</p>

          <form className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="login-button">
              Sign In
            </button>

            <p className="register-link">
              Don't have an account?
              <Link to="/register"> Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;