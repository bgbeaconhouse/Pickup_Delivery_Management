// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // Replace this with your actual authentication check
  const isAuthenticated = localStorage.getItem('token'); // Example: Check for a token

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;