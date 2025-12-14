/**
 * PROTECTED ROUTE COMPONENT
 * 
 * Route guard that protects routes requiring authentication
 * Checks if user is logged in before allowing access
 * Redirects to login if not authenticated
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * 
 * Usage:
 * <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 * 
 * Logic:
 * 1. Check if user is authenticated (via AuthContext)
 * 2. If authenticated → Render children (protected component)
 * 3. If not authenticated → Redirect to /login
 * 4. While loading → Show nothing (or loading spinner)
 * 
 * @param {ReactNode} children - Component to render if authenticated
 * @param {boolean} adminOnly - If true, only allows admin users
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Show nothing while checking authentication
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If admin-only route and user is not admin, redirect to home
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // User is authenticated (and admin if required), render children
  return children;
};

export default ProtectedRoute;

