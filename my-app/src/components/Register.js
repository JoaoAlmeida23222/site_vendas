import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",  // Default role is user
    adminCode: "",  // Admin code field for validation
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminRole, setShowAdminRole] = useState(false);  // Track if the admin role dropdown should be visible

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Show the admin role dropdown if the correct admin code is entered
    if (e.target.name === "adminCode" && e.target.value === "mySecret123"
    ) {
      setShowAdminRole(true); // Show admin role option
    } else if (e.target.name === "adminCode" && e.target.value !== "mySecret123") {
      setShowAdminRole(false); // Hide admin role option
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,  // Send the selected role
        adminCode: formData.adminCode,  // Send the admin code
      });

      // ✅ Check if the response contains a valid token
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/profile");
      } else {
        setError("Invalid registration response. Token not found.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <button className="close-button" onClick={() => navigate("/")}>×</button>
        <h2>Create Account</h2>
        <p className="subtitle">Please fill in your information to register</p>

        <form onSubmit={handleSubmit} className="register-form">
          {/* Name Input */}
          <div className="input-group">
            <label className="input-label">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email Input */}
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="Create a password"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div className="input-group">
            <label className="input-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field"
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Admin Code Input */}
          <div className="input-group">
            <label className="input-label">Admin Code (Optional)</label>
            <input
              type="text"
              name="adminCode"
              value={formData.adminCode}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter invite code if you have one"
            />
          </div>

          {/* Role Dropdown (Visible if adminCode matches secret code) */}
          {showAdminRole && (
            <div className="input-group">
              <label className="input-label">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="register-button"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Error Message */}
          {error && <p className="error-message">{error}</p>}

          {/* Login Link */}
          <p className="login-link">
            Already have an account? <a href="/login" className="login-link-text">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;