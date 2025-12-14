/**
 * DASHBOARD PAGE
 * 
 * User's personal dashboard
 * Shows user profile, my resources, and bookmarks
 * Protected route - requires authentication
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resourceAPI, userAPI } from '../services/api';
import ResourceCard from '../components/ResourceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import CreateResourceModal from '../components/CreateResourceModal';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [myResources, setMyResources] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-resources');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  /**
   * Fetch User Data
   * Loads user's resources and bookmarks
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user's resources
        const resourcesResponse = await resourceAPI.getMyResources();
        setMyResources(resourcesResponse.data.data.resources || []);

        // Fetch bookmarks
        const bookmarksResponse = await userAPI.getBookmarks();
        setBookmarks(bookmarksResponse.data.data.bookmarks || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshData = () => {
    resourceAPI.getMyResources().then((response) => {
      setMyResources(response.data.data.resources || []);
    });
    userAPI.getBookmarks().then((response) => {
      setBookmarks(response.data.data.bookmarks || []);
    });
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="container">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="container">
        {/* User Profile Section */}
        <div className="dashboard-header">
          <div className="profile-card">
            <h2>Welcome, {user?.name}!</h2>
            <div className="profile-info">
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Role:</strong>{' '}
                <span className="role-badge">{user?.role}</span>
              </p>
            </div>
          </div>

          <div className="stats-card">
            <div className="stat">
              <h3>{myResources.length}</h3>
              <p>My Resources</p>
            </div>
            <div className="stat">
              <h3>{bookmarks.length}</h3>
              <p>Bookmarks</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <Link to="/resources" className="btn btn-secondary">
            Browse All Resources
          </Link>
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Create New Resource
          </button>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab ${activeTab === 'my-resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-resources')}
          >
            My Resources ({myResources.length})
          </button>
          <button
            className={`tab ${activeTab === 'bookmarks' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookmarks')}
          >
            Bookmarks ({bookmarks.length})
          </button>
        </div>

        {/* Content */}
        <div className="dashboard-content">
          {activeTab === 'my-resources' ? (
            <div>
              {myResources.length > 0 ? (
                <div className="resources-list">
                  {myResources.map((resource) => (
                    <ResourceCard
                      key={resource._id}
                      resource={resource}
                      onUpdate={refreshData}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>You haven't created any resources yet.</p>
                  <p>Click "Create New Resource" to get started!</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              {bookmarks.length > 0 ? (
                <div className="resources-list">
                  {bookmarks.map((resource) => (
                    <ResourceCard
                      key={resource._id}
                      resource={resource}
                      onUpdate={refreshData}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>You haven't bookmarked any resources yet.</p>
                  <p>Browse resources and bookmark your favorites!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Resource Modal */}
      <CreateResourceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          // Refresh data after successful creation
          refreshData();
        }}
      />
    </div>
  );
};

export default Dashboard;

