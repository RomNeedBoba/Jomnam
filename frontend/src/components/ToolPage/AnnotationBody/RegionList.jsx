import React, { useEffect, useState } from 'react';
import './RegionList.css';

const OverlayEditor = ({ selectedRegion, onUpdateDescription, onDelete, onSelectRegion, regionList }) => {
  const [description, setDescription] = useState(selectedRegion?.description || '');

  useEffect(() => {
    setDescription(selectedRegion?.description || '');
  }, [selectedRegion]);

  const handleSave = () => {
    if (selectedRegion) {
      onUpdateDescription(selectedRegion.id, description);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSave();
  };

  // Only render the overlay when a region is selected
  if (!selectedRegion) {
    return null;  // No overlay editor shown if no region is selected
  }

  return (
    <div className="overlay-editor">
      {/* Display Class Name */}
      <div className="overlay-title">
        Class Name: {selectedRegion?.class || 'None'}
      </div>

      {/* Display Region Shape only when a region is selected */}
      <div className="overlay-shape">
        <strong>Shape: </strong> {selectedRegion?.shape || 'Not selected'}
      </div>

      {/* Description Input */}
      <input
        className="overlay-input"
        type="text"
        placeholder="Enter description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={handleKeyPress}
      />

      <div className="overlay-actions">
        <button className="delete-btn" onClick={() => onDelete(selectedRegion?.id)}>
          Delete
        </button>
        <button className="save-btn" onClick={handleSave}>
          Save (Enter)
        </button>
      </div>

      {/* Region List */}
      {regionList?.length > 1 && (
        <div className="region-list-scroll">
          {regionList.map((r, i) => (
            <div
              key={r.id}
              className={`region-item ${selectedRegion?.id === r.id ? 'active' : ''}`}
              onClick={() => onSelectRegion(r.id)}
            >
              {i + 1}. {r.class}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OverlayEditor;
