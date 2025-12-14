/**
 * MODAL COMPONENT
 * 
 * Reusable modal component with backdrop
 * Supports closing on backdrop click, ESC key, and cancel button
 * Used for forms, confirmations, and other overlay content
 */

import React, { useEffect } from 'react';
import './Modal.css';

/**
 * Modal Component
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Function to call when modal should close
 * @param {string} title - Modal title
 * @param {ReactNode} children - Content to display in modal
 * @param {string} size - Modal size: 'small', 'medium', 'large' (default: 'medium')
 */
const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  /**
   * Handle ESC Key Press
   * Closes modal when ESC key is pressed
   */
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Don't render if modal is closed
  if (!isOpen) return null;

  /**
   * Handle Backdrop Click
   * Closes modal when clicking outside the modal content
   */
  const handleBackdropClick = (e) => {
    // Only close if clicking the backdrop itself, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={`modal-content modal-${size}`} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        {title && (
          <div className="modal-header">
            <h2>{title}</h2>
            <button
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

