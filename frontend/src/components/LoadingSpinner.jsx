/**
 * LOADING SPINNER COMPONENT
 * 
 * Simple loading indicator
 * Used while data is being fetched
 */

import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;

