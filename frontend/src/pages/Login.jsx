/**
 * LOGIN PAGE
 * 
 * User authentication page
 * Allows users to login with email and password
 * Redirects to dashboard on successful login
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle Input Change
   * Updates form data state
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error on input change
  };

  /**
   * Handle Form Submit
   * Authenticates user and redirects based on role
   * 
   * ROLE-BASED REDIRECTION:
   * - Admin users → /admin (Admin Dashboard)
   * - Learner users → /dashboard (User Dashboard)
   * 
   * SECURITY NOTE:
   * Role is determined by backend, not user input.
   * This prevents privilege escalation attacks.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);
      
      // Get user role from response
      // The login function returns user data including role
      const userData = response.data?.data?.user;
      const userRole = userData?.role;
      
      // Redirect based on role (Authorization check)
      // AUTHENTICATION: We verified WHO the user is (email/password check)
      // AUTHORIZATION: Now we determine WHAT they can access based on role
      if (userRole === 'admin') {
        navigate('/admin'); // Admin dashboard
      } else {
        navigate('/dashboard'); // Learner dashboard (default for all new registrations)
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.message || err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <p className="auth-subtitle">Welcome back! Please login to continue.</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

