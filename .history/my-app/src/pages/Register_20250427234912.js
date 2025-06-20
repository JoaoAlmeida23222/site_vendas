import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("You must agree to the terms and privacy policy.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Registration failed.');
      }

      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwt_decode(credentialResponse.credential);
      
      // Send Google auth data to your backend
      const response = await fetch('http://localhost:5001/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Google authentication failed.');
      }

      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleError = () => {
    setError('Google authentication failed. Please try again.');
  };

  return (
    <div className="register-page">
      <nav className="navbar">
        <Link to="/" className="logo">LOGO</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="auth-buttons">
          <Link to="/login" className="auth-button">Login</Link>
          <Link to="/register" className="auth-button">Register</Link>
        </div>
      </nav>

      <div className="register-container">
        <div className="register-box">
          <h2>Create Account</h2>
          <p>Please fill in your information to get started</p>

          {/* Google Sign-In Button */}
          <div className="google-signin-container">
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
  <GoogleLogin
    onSuccess={async (credentialResponse) => {
      try {
        const response = await fetch('http://localhost:5001/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: credentialResponse.credential })
        });
        const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate('/');
      } catch (error) {
        setError('Google login failed');
      }
    }}
    onError={() => setError('Google login failed')}
    text="signup_with"
  />
</GoogleOAuthProvider>
          </div>

          <div className="divider">
            <span>OR</span>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Rest of your form remains the same */}
            {/* ... */}

            <button type="submit" className="register-button">
              Create Account
            </button>

            <p className="login-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>

      <footer className="footer">
        <p>© 2025 Your Brand. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Register;