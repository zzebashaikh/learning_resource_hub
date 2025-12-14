/**
 * ADMIN PAGE
 * 
 * Admin-only page for managing users and resources
 * Protected route - requires admin role
 * 
 * AUTHORIZATION:
 * This page is protected by ProtectedRoute with adminOnly={true}
 * Only users with role === 'admin' can access this page
 * Backend also validates admin role on all admin API endpoints
 * 
 * This implements defense-in-depth: both frontend and backend authorization
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI, resourceAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmationModal from '../components/ConfirmationModal';
import './Admin.css';

const Admin = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  /**
   * Fetch Admin Data
   * Loads all users and resources for admin management
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all users (admin only)
        const usersResponse = await userAPI.getAllUsers();
        setUsers(usersResponse.data.data.users || []);

        // Fetch all resources
        const resourcesResponse = await resourceAPI.getResources();
        setResources(resourcesResponse.data.data.resources || []);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Open Delete Confirmation Modal
   * Sets the resource ID to delete and opens the confirmation modal
   */
  const handleDeleteClick = (resourceId) => {
    setResourceToDelete(resourceId);
    setDeleteModalOpen(true);
  };

  /**
   * Handle Delete Resource Confirmation
   * Admin can delete ANY resource (not just their own)
   * This is different from learner permissions
   */
  const handleDeleteConfirm = async () => {
    if (!resourceToDelete) return;

    try {
      await resourceAPI.deleteResource(resourceToDelete);
      setResources(resources.filter((r) => r._id !== resourceToDelete));
      // Refresh stats after deletion
      const resourcesResponse = await resourceAPI.getResources();
      setResources(resourcesResponse.data.data.resources || []);
    } catch (error) {
      alert('Error deleting resource: ' + (error.response?.data?.message || error.message));
    } finally {
      setResourceToDelete(null);
    }
  };

  /**
   * Close Delete Modal
   * Resets the resource to delete state
   */
  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setResourceToDelete(null);
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="container">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalUsers = users.length;
  const totalResources = resources.length;
  const totalLearners = users.filter((u) => u.role === 'learner').length;
  const totalAdmins = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="admin-container">
      <div className="container">
        <h1>Admin Panel</h1>
        <p className="admin-subtitle">
          Welcome, {user?.name}. Manage users and resources.
        </p>

        {/* Statistics Overview */}
        <div className="admin-stats">
          <div className="stat-card">
            <h3>{totalUsers}</h3>
            <p>Total Users</p>
          </div>
          <div className="stat-card">
            <h3>{totalLearners}</h3>
            <p>Learners</p>
          </div>
          <div className="stat-card">
            <h3>{totalAdmins}</h3>
            <p>Admins</p>
          </div>
          <div className="stat-card">
            <h3>{totalResources}</h3>
            <p>Total Resources</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users ({users.length})
          </button>
          <button
            className={`tab ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            All Resources ({resources.length})
          </button>
        </div>

        {/* Content */}
        <div className="admin-content">
          {activeTab === 'overview' ? (
            <div className="overview-section">
              <div className="overview-card">
                <h3>System Overview</h3>
                <div className="overview-stats">
                  <div className="overview-item">
                    <strong>Total Users:</strong> {totalUsers}
                  </div>
                  <div className="overview-item">
                    <strong>Learners:</strong> {totalLearners}
                  </div>
                  <div className="overview-item">
                    <strong>Admins:</strong> {totalAdmins}
                  </div>
                  <div className="overview-item">
                    <strong>Total Resources:</strong> {totalResources}
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'users' ? (
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge ${u.role}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="resources-list">
              {resources.map((resource) => (
                <div key={resource._id} className="admin-resource-card">
                  <div className="resource-info">
                    <h3>{resource.title}</h3>
                    <p>{resource.description}</p>
                    <p>
                      <strong>Category:</strong> {resource.category}
                    </p>
                    <p>
                      <strong>Created by:</strong> {resource.createdBy?.name}
                    </p>
                    <p>
                      <strong>Likes:</strong> {resource.likes?.length || 0}
                    </p>
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteClick(resource._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this resource? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Admin;

