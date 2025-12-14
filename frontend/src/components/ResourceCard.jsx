/**
 * RESOURCE CARD COMPONENT
 * 
 * Displays a single learning resource in a card format
 * Shows resource details, actions (like, bookmark, rate)
 * Used in resource lists and search results
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resourceAPI, userAPI } from '../services/api';
import { Heart, Star, Bookmark } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import './ResourceCard.css';

const ResourceCard = ({ resource, onUpdate }) => {
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(
    resource.likes?.some((id) => id.toString() === user?.id?.toString()) || false
  );
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  // Get user's current rating if exists
  const userRating = resource.ratings?.find(
    (r) => r.user?.toString() === user?.id?.toString()
  )?.rating || 0;
  
  // Calculate average rating for display
  const averageRating = resource.averageRating || 0;

  /**
   * Handle Like/Unlike
   * Toggles like status for the resource
   */
  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Please login to like resources');
      return;
    }

    setLoading(true);
    try {
      await resourceAPI.likeResource(resource._id);
      setIsLiked(!isLiked);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error liking resource:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Bookmark Toggle
   * Adds or removes resource from bookmarks
   */
  const handleBookmark = async () => {
    if (!isAuthenticated) {
      alert('Please login to bookmark resources');
      return;
    }

    setLoading(true);
    try {
      await userAPI.toggleBookmark(resource._id);
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error bookmarking resource:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Rating
   * Submits a rating (1-5 stars) for the resource
   */
  const handleRate = async (rating) => {
    if (!isAuthenticated) {
      alert('Please login to rate resources');
      return;
    }

    setLoading(true);
    try {
      await resourceAPI.rateResource(resource._id, rating);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error rating resource:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Delete Confirmation
   * Deletes the resource after user confirms
   */
  const handleDeleteConfirm = async () => {
    try {
      await resourceAPI.deleteResource(resource._id);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Error deleting resource: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="resource-card">
      <div className="resource-header">
        <h3>{resource.title}</h3>
        <span className="resource-category">{resource.category}</span>
      </div>

      <p className="resource-description">{resource.description}</p>

      <div className="resource-meta">
        <div className="resource-stats">
          <span><Heart size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {resource.likes?.length || 0} likes</span>
          <span className="rating-display">
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = star <= Math.round(averageRating);
              return (
                <Star
                  key={star}
                  size={16}
                  className={isFilled ? 'star-filled' : 'star-empty'}
                  fill={isFilled ? 'currentColor' : 'none'}
                />
              );
            })}
            <span style={{ marginLeft: '4px' }}>{averageRating.toFixed(1)}</span>
          </span>
          <span>By: {resource.createdBy?.name || 'Unknown'}</span>
        </div>

        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="resource-link"
        >
          Visit Resource →
        </a>
      </div>

      {isAuthenticated && (
        <div className="resource-actions">
          <button
            onClick={handleLike}
            disabled={loading}
            className={`action-btn ${isLiked ? 'liked' : ''}`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} style={{ marginRight: '4px' }} />
            {isLiked ? 'Liked' : 'Like'}
          </button>

          <button
            onClick={handleBookmark}
            disabled={loading}
            className={`action-btn ${isBookmarked ? 'bookmarked' : ''}`}
          >
            <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} style={{ marginRight: '4px' }} />
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>

          <div className="rating-section">
            <span>Rate: </span>
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = star <= userRating;
              return (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  disabled={loading}
                  className="star-btn"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    size={18}
                    className={isFilled ? 'star-filled' : 'star-empty'}
                    fill={isFilled ? 'currentColor' : 'none'}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Show edit/delete buttons only if user is creator or admin */}
      {isAuthenticated &&
        (user?.id?.toString() === resource.createdBy?._id?.toString() || user?.role === 'admin') && (
          <div className="resource-owner-actions">
            <Link
              to={`/resources/${resource._id}/edit`}
              className="btn btn-secondary"
            >
              Edit
            </Link>
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="btn btn-danger"
            >
              Delete
            </button>
          </div>
        )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this resource? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default ResourceCard;

