/**
 * CREATE RESOURCE MODAL
 * 
 * Modal form for creating a new learning resource
 * Replaces browser prompts with a professional UI
 * Includes validation and error handling
 */

import React, { useState } from 'react';
import Modal from './Modal';
import { resourceAPI } from '../services/api';
import './CreateResourceModal.css';

/**
 * CreateResourceModal Component
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Function to call when modal closes
 * @param {function} onSuccess - Callback when resource is created successfully
 */
const CreateResourceModal = ({ isOpen, onClose, onSuccess }) => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    link: '',
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Available categories (matching backend enum)
  const categories = [
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
   * Reset form when modal closes
   */
  React.useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        description: '',
        category: '',
        link: '',
      });
      setErrors({});
      setSubmitError('');
    }
  }, [isOpen]);

  /**
   * Handle Input Change
   * Updates form data and clears related errors
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
    setSubmitError('');
  };

  /**
   * Validate Form
   * Checks all required fields and formats
   * @returns {boolean} True if valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    // Link validation
    if (!formData.link.trim()) {
      newErrors.link = 'Resource link is required';
    } else {
      // Basic URL validation
      try {
        const url = new URL(formData.link);
        if (!['http:', 'https:'].includes(url.protocol)) {
          newErrors.link = 'URL must start with http:// or https://';
        }
      } catch (e) {
        newErrors.link = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle Form Submit
   * Validates form and creates resource via API
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create resource via API
      await resourceAPI.createResource({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        link: formData.link.trim(),
      });

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }

      // Close modal
      onClose();
    } catch (error) {
      // Handle API errors
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to create resource. Please try again.';
      setSubmitError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Resource"
      size="medium"
    >
      <form onSubmit={handleSubmit} className="create-resource-form">
        {/* General Error Message */}
        {submitError && <div className="form-error">{submitError}</div>}

        {/* Title Field */}
        <div className="form-group">
          <label htmlFor="title">
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter resource title"
            maxLength={100}
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        {/* Description Field */}
        <div className="form-group">
          <label htmlFor="description">
            Description <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the learning resource"
            rows={4}
            maxLength={500}
            className={errors.description ? 'error' : ''}
          />
          <div className="char-count">
            {formData.description.length}/500 characters
          </div>
          {errors.description && (
            <span className="field-error">{errors.description}</span>
          )}
        </div>

        {/* Category Field */}
        <div className="form-group">
          <label htmlFor="category">
            Category <span className="required">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? 'error' : ''}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="field-error">{errors.category}</span>
          )}
        </div>

        {/* Link Field */}
        <div className="form-group">
          <label htmlFor="link">
            Resource Link (URL) <span className="required">*</span>
          </label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://example.com/resource"
            className={errors.link ? 'error' : ''}
          />
          {errors.link && <span className="field-error">{errors.link}</span>}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Resource'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateResourceModal;

