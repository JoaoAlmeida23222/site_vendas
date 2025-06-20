import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check if user is logged in
  const isAuthenticated = localStorage.getItem('token'); 

  if (!isAuthenticated) {
    
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
