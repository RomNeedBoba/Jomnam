import React from 'react';
import './JsonPathModal.css'; // Make sure this CSS is styled well

const JsonPathModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="json-modal-overlay">
      <div className="json-modal-content">
        <h2 className="json-modal-title">Where should we save your annotations?</h2>
        <p className="json-modal-subtitle">
          This tool doesn't store anything in the cloud. Please choose how you'd like to manage your own JSON files.
        </p>

        <div className="json-modal-buttons">
          <button className="confirm-btn" onClick={onConfirm}>
            Create File in My Folder
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default JsonPathModal;
