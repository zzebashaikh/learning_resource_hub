/**
 * RESOURCES PAGE
 * 
 * Displays all learning resources with search and filter
 * Similar to Home but focused on resource browsing
 */

import React, { useState, useEffect } from 'react';
import { resourceAPI } from '../services/api';
import ResourceCard from '../components/ResourceCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import './Resources.css';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  /**
   * Fetch Resources
   * Loads resources with search, filter, and sort options
   */
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const params = { sort: sortBy };
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
  }, [searchTerm, category, sortBy]);

  const refreshResources = () => {
    const params = { sort: sortBy };
    if (searchTerm) params.search = searchTerm;
    if (category) params.category = category;
    resourceAPI.getResources(params).then((response) => {
      setResources(response.data.data.resources || []);
    });
  };

  return (
    <div className="resources-page">
      <div className="container">
        <h1>All Learning Resources</h1>

        <div className="resources-controls">
          <SearchBar onSearch={setSearchTerm} onFilter={setCategory} />

          <div className="sort-controls">
            <label>Sort by: </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating">Highest Rated</option>
              <option value="likes">Most Liked</option>
            </select>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : resources.length > 0 ? (
          <div className="resources-list">
            {resources.map((resource) => (
              <ResourceCard
                key={resource._id}
                resource={resource}
                onUpdate={refreshResources}
              />
            ))}
          </div>
        ) : (
          <div className="no-resources">
            <p>No resources found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;

