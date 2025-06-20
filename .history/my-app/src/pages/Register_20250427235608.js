import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: '',
  });
  const [error, setError] = useState('');

  // ... (keep your existing handleChange and handleSubmit functions)

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('http://localhost:5001/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      });
      
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        setError(data.error || 'Google login failed');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  return (
    <div className="register-page">
      {/* Keep your existing navbar */}
      
      <div className="register-container">
        <div className="register-box">
          <h2>Create Account</h2>
          <p>Please fill in your information to register</p>

          {/* Add Google Sign-In Button Here */}
          <div className="google-auth-container">
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google login failed')}
                text="signup_with"
                shape="rectangular"
                size="large"
                width="350"
              />
            </GoogleOAuthProvider>
          </div>

          <div className="divider">
            <span>OR</span>
          </div>

          {/* Your existing form */}
          <form className="register-form" onSubmit={handleSubmit}>
            {/* Keep all your existing form fields */}
            
            <button type="submit" className="register-button">
              CREATE ACCOUNT
            </button>

            <p className="login-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>

      {/* Keep your existing footer */}
    </div>
  );
};

export default Register;