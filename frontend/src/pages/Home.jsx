/**
 * HOME PAGE
 * 
 * Landing page of the application
 * Shows featured resources and welcome message
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resourceAPI } from '../services/api';
import ResourceCard from '../components/ResourceCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  /**
   * Fetch Resources
   * Loads resources from API with optional search and filter
   */
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (category) params.category = category;

        const response = await resourceAPI.getResources(params);
        setResources(response.data.data.resources || []);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [searchTerm, category]);

  return (
    <div className="home-container">
      <div className="container">
        {/* Hero Section */}
        <div className="hero-section">
          <h1>Welcome to Learning Resource Hub</h1>
          <p className="hero-subtitle">
            Discover, share, and bookmark the best learning resources
          </p>
          {!isAuthenticated && (
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <SearchBar onSearch={setSearchTerm} onFilter={setCategory} />

        {/* Resources Section */}
        <div className="resources-section">
          <h2>Learning Resources</h2>
          {loading ? (
            <LoadingSpinner />
          ) : resources.length > 0 ? (
            <div className="resources-grid">
              {resources.map((resource) => (
                <ResourceCard
                  key={resource._id}
                  resource={resource}
                  onUpdate={() => {
                    // Refresh resources after update
                    const params = {};
                    if (searchTerm) params.search = searchTerm;
                    if (category) params.category = category;
                    resourceAPI.getResources(params).then((response) => {
                      setResources(response.data.data.resources || []);
                    });
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="no-resources">
              <p>No resources found. Be the first to share one!</p>
              {isAuthenticated && (
                <Link to="/dashboard" className="btn btn-primary">
                  Create Resource
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

