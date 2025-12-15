/**
 * API SERVICE LAYER
 * 
 * Centralized API configuration and service functions
 * Uses Axios for HTTP requests
 * Automatically adds JWT token to requests via interceptors
 */

import axios from 'axios';

// API base URL for local development
// Backend runs on http://localhost:5001
const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Automatically adds JWT token to all requests from localStorage
 * This ensures authenticated requests include the token
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles common errors (401 = unauthorized, token expired)
 * Automatically logs out user if token is invalid
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login will be handled by ProtectedRoute
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * AUTHENTICATION API
 * Handles user registration, login, and profile
 */
export const authAPI = {
  // Register a new user
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),

  // Login user and get JWT token
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  // Get current user profile (requires authentication)
  getMe: () => api.get('/auth/me'),
};

/**
 * RESOURCE API
 * Handles all resource-related operations
 */
export const resourceAPI = {
  // Get all resources (with optional search, filter, pagination)
  getResources: (params = {}) => api.get('/resources', { params }),

  // Get single resource by ID
  getResource: (id) => api.get(`/resources/${id}`),

  // Create new resource (requires authentication)
  createResource: (data) => api.post('/resources', data),

  // Update resource (requires authentication, creator or admin only)
  updateResource: (id, data) => api.put(`/resources/${id}`, data),

  // Delete resource (requires authentication, creator or admin only)
  deleteResource: (id) => api.delete(`/resources/${id}`),

  // Like/unlike resource (requires authentication)
  likeResource: (id) => api.put(`/resources/${id}/like`),

  // Rate resource 1-5 stars (requires authentication)
  rateResource: (id, rating) => api.post(`/resources/${id}/rate`, { rating }),

  // Get current user's resources (requires authentication)
  getMyResources: () => api.get('/resources/user/my-resources'),
};

/**
 * USER API
 * Handles user-related operations
 */
export const userAPI = {
  // Get all users (admin only)
  getAllUsers: () => api.get('/users'),

  // Toggle bookmark (requires authentication)
  toggleBookmark: (resourceId) => api.put(`/users/bookmark/${resourceId}`),

  // Get user's bookmarks (requires authentication)
  getBookmarks: () => api.get('/users/bookmarks'),
};

export default api;
