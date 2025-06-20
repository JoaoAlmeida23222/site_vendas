import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatarFile: null // NEW
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Decode token to check role
        try {
          const decoded = jwtDecode(token);
          setIsAdmin(decoded.role === 'admin'); // 🔐 Assumes token has a `role` field
        } catch (err) {
          console.error('Error decoding token:', err);
        }

        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setIsAdmin(data.user.role === 'admin');
          setFormData(prev => ({
            ...prev,
            name: data.user.name,
            email: data.user.email
          }));
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    try {
      const token = localStorage.getItem('token');
  
      // First update profile info
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
  
      // If avatar file exists, upload it
      if (formData.avatarFile) {
        const formDataObj = new FormData();
        formDataObj.append('file', formData.avatarFile);
  
        const avatarRes = await fetch('/api/user/avatar', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataObj
        });
  
        if (!avatarRes.ok) {
          const avatarErr = await avatarRes.json();
          throw new Error(avatarErr.message || 'Failed to upload avatar');
        }
      }
  
      // Re-fetch updated user
      const refreshed = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const updatedData = await refreshed.json();
      setUser(updatedData.user);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };
  

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <button className="edit-button" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>Personal Information</h2>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
  <label>Avatar</label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => setFormData({ ...formData, avatarFile: e.target.files[0] })}
  />
</div>


                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password to confirm changes"
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <button type="submit" className="save-button">Save Changes</button>
              </form>
            ) : (
              <div className="profile-info">
  {user.avatar && (
    <div className="info-group">
      <label>Avatar</label>
      <img 
        src={user.avatar} 
        alt="User Avatar" 
        style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }}
      />
    </div>
  )}
  <div className="info-group">
    <label>Name</label>
    <p>{user.name}</p>
  </div>
  <div className="info-group">
    <label>Email</label>
    <p>{user.email}</p>
  </div>
  <div className="info-group">
    <label>Role</label>
    <p>{user.role}</p>
  </div>
  <div className="info-group">
    <label>Member Since</label>
    <p>{new Date(user.createdAt).toLocaleDateString()}</p>
  </div>
</div>

            )}
          </div>

          <div className="profile-section">
            <h2>Order History</h2>
            <div className="order-history">
              {user.orders && user.orders.length > 0 ? (
                user.orders.map(order => (
                  <div key={order.id} className="order-item">
                    <div className="order-header">
                      <span>Order #{order.id}</span>
                      <span>{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <div className="order-details">
                      <span>Status: {order.status}</span>
                      <span>Total: ${order.total}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No orders yet</p>
              )}
            </div>
          </div>

          {/* 🔒 Admin-Only Section */}
          {isAdmin && (
            <div className="profile-section admin-panel">
              <h2>Admin Panel</h2>
              <p>You have admin privileges. You can manage products here:</p>
              <Link to="/admin" className="admin-button">Go to Admin Dashboard</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
