// components/ToolPage/AnnotationBody/RegionAttributeModal.jsx
import React, { useState } from 'react';
import './AnnotationBody.css';

const RegionAttributeModal = ({ onSave, onCancel }) => {
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    onSave({ description: description.trim() });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="modal-close" onClick={onCancel}>&times;</span>
        <h3 className="modal-title">📝 Region Description</h3>
        <p className="modal-description">Add a short description or attribute for this region.</p>

        <textarea
          className="modal-input"
          rows={3}
          placeholder="Enter region description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="modal-footer">
          <button className="save-button" onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default RegionAttributeModal;
