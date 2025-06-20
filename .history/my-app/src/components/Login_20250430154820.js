import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Importe o arquivo CSS

const Login = ({ onLogin = () => {} }) => { // Default to empty function
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
      const response = await axios.post("/api/auth/login", { 
        email, 
        password,
        rememberMe 
      });

      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);
        onLogin(); // still works even if no onLogin is passed
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

  return (
    <div className="login-container">
      <na
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
            <a href="/forgot-password" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>

          {error && <p className="error-message">{error}</p>}

          <p className="register-link">
            Don't have an account? <a href="/register" className="register-link-text">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
