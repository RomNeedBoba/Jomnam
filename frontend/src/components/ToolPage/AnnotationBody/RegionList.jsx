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

  return (
    <div className="overlay-editor">
      <div className="overlay-title">Class Name: {selectedRegion?.class || 'None'}</div>

      <input
        className="overlay-input"
        type="text"
        placeholder="Enter description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={handleKeyPress}
      />

      <div className="overlay-actions">
        <button className="delete-btn" onClick={() => onDelete(selectedRegion?.id)}>Delete</button>
        <button className="save-btn" onClick={handleSave}>Save (Enter)</button>
      </div>

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
