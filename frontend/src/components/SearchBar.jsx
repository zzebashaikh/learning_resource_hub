/**
 * SEARCH BAR COMPONENT
 * 
 * Search and filter interface for resources
 * Allows searching by keyword and filtering by category
 */

import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  const categories = [
    'All Categories',
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Programming Languages',
    'Database',
    'DevOps',
    'UI/UX Design',
    'Cybersecurity',
    'Other',
  ];

  /**
   * Handle Search Input Change
   * Updates search term and triggers search
   */
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  /**
   * Handle Category Filter Change
   * Updates category filter and triggers filter
   */
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    if (onFilter) {
      onFilter(value === 'All Categories' ? '' : value);
    }
  };

  return (
    <div className="search-bar">
      <div className="search-input-group">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="filter-group">
        <select
          value={category}
          onChange={handleCategoryChange}
          className="filter-select"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;

