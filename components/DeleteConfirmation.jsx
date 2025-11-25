import React from 'react';

const DeleteConfirmation = ({ onConfirm, onCancel, taskTitle }) => {
  return (
    <div className="modal-overlay">
      <div className="modal card delete-confirmation">
        <h2>⚠️ Delete Task</h2>
        <p>
          Are you sure you want to delete <strong>"{taskTitle}"</strong>? This action cannot be
          undone.
        </p>
        <div className="form-actions">
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
