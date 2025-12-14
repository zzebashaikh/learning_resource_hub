/**
 * AUTH CONTEXT
 * 
 * Global state management for authentication
 * Provides user data, token, and auth functions to all components
 * Uses Context API to avoid prop drilling
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

// Create AuthContext
const AuthContext = createContext();

/**
 * AuthProvider Component
 * Wraps the entire app and provides authentication state
 * 
 * State Management:
 * - user: Current logged-in user object (null if not logged in)
 * - token: JWT token stored in localStorage
 * - loading: Loading state during auth checks
 * - isAuthenticated: Boolean indicating if user is logged in
 */
export const AuthProvider = ({ children }) => {
  // State variables
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  /**
   * Check if user is authenticated
   * Runs on component mount and when token changes
   */
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          // Verify token is still valid by fetching user data
          const response = await authAPI.getMe();
          setUser(response.data.data.user);
          setToken(storedToken);
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  /**
   * Register Function
   * Creates a new user account
   * 
   * @param {string} name - User's full name
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise} API response with user data and token
   */
  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register(name, email, password);
      const { user: userData, token: newToken } = response.data.data;

      // Store token and user in localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update state
      setUser(userData);
      setToken(newToken);

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  /**
   * Login Function
   * Authenticates user and stores JWT token
   * 
   * AUTHENTICATION vs AUTHORIZATION:
   * - Authentication: Verifies WHO the user is (email/password check)
   * - Authorization: Determines WHAT the user can do (role-based access)
   * 
   * The role is returned from backend after successful authentication.
   * Frontend uses this role for authorization (redirects, UI visibility).
   * 
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise} API response with user data and token (includes role)
   */
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { user: userData, token: newToken } = response.data.data;

      // Store token and user in localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update state
      setUser(userData);
      setToken(newToken);

      // Return response with user data for role-based redirect
      // Login component needs access to user.role for authorization
      return {
        data: {
          data: {
            user: userData
          }
        }
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  /**
   * Logout Function
   * Clears authentication state and redirects to login
   */
  const logout = () => {
    // Remove from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Clear state
    setUser(null);
    setToken(null);
  };

  // Value object to provide to consumers
  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth Hook
 * Custom hook to access AuthContext
 * Makes it easier to use auth context in components
 * 
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;

