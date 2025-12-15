/**
 * ENTRY POINT
 * 
 * This is the main entry point of the React application
 * Renders the App component into the DOM
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Get root element from public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

