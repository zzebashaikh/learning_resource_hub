/**
 * CONFIRMATION MODAL COMPONENT
 * 
 * Reusable confirmation modal for delete actions and other confirmations
 * Uses the base Modal component with pre-configured delete confirmation UI
 * 
 * Features:
 * - Clear warning message
 * - Cancel and Delete buttons
 * - Theme-aware styling
 * - Keyboard accessible (ESC closes)
 * - Backdrop click closes modal
 */

import React from 'react';
import Modal from './Modal';
import './ConfirmationModal.css';

/**
 * ConfirmationModal Component
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Function to call when modal should close (cancel)
 * @param {function} onConfirm - Function to call when user confirms action
 * @param {string} title - Modal title (default: "Confirm Deletion")
 * @param {string} message - Warning message (default: "This action cannot be undone")
 * @param {string} confirmText - Text for confirm button (default: "Delete")
 * @param {string} cancelText - Text for cancel button (default: "Cancel")
 */
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
}) => {
  /**
   * Handle Confirm Action
   * Calls onConfirm and closes modal
   */
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <div className="confirmation-modal-content">
        <p className="confirmation-message">{message}</p>
        <div className="confirmation-actions">
          <button
            className="btn btn-secondary confirmation-cancel"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            className="btn btn-danger confirmation-confirm"
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
