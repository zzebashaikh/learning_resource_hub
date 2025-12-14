/**
 * MAIN APP COMPONENT
 * 
 * Root component of the React application
 * Sets up routing, authentication context, and layout
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import Admin from './pages/Admin';

/**
 * App Component
 * 
 * Structure:
 * - AuthProvider wraps entire app (provides auth context)
 * - Router enables client-side routing
 * - Navbar appears on all pages
 * - Routes define page components
 * - ProtectedRoute guards authenticated routes
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Navigation bar - appears on all pages */}
          <Navbar />

          {/* Main content area with routes */}
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/resources" element={<Resources />} />

              {/* Protected Routes - Require Authentication */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Route - Requires Admin Role */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          {/* Footer (optional) */}
          <footer style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
            <p>&copy; 2024 Learning Resource Hub. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

