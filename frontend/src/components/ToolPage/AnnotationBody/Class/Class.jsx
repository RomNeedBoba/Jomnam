import React, { useState } from 'react';
import './Class.css';

const trashIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 3V4H4V6H5V19C5 20.65 6.35 22 8 22H16C17.65 22 19 20.65 19 19V6H20V4H15V3H9ZM7 6H17V19C17 19.55 16.55 20 16 20H8C7.45 20 7 19.55 7 19V6ZM9 8V18H11V8H9ZM13 8V18H15V8H13Z"/>
  </svg>
);

const ClassManager = ({ regions, onRegionSelect }) => {
  const [classes, setClasses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [newClassInput, setNewClassInput] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });
  const [selectedRegion, setSelectedRegion] = useState(null);  // New state for selected region

  const openAddModal = () => {
    setNewClassInput('');
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const openModifyModal = () => {
    if (classes.length > 0) setShowModifyModal(true);
  };

  const closeModifyModal = () => {
    setShowModifyModal(false);
  };

  const showToastMessage = (message, type) => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: '' }), 2500);
  };

  const addNewClass = () => {
    const trimmed = newClassInput.trim();
    if (!trimmed) {
      showToastMessage('Class name cannot be empty.', 'error');
      return;
    }
    const exists = classes.some(cls => cls.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      showToastMessage('Duplicate class name.', 'error');
      return;
    }
    setClasses(prev => [...prev, { name: trimmed, count: prev.length + 1 }]);
    showToastMessage('Class added successfully!', 'success');
    setShowAddModal(false);
  };

  const handleRemoveClass = (index) => {
    const updatedClasses = classes.filter((_, i) => i !== index).map((cls, i) => ({
      ...cls,
      count: i + 1, // Re-index numbers
    }));
    setClasses(updatedClasses);
    showToastMessage('Class removed successfully!', 'success');

    // If no classes left, close the modify modal
    if (updatedClasses.length === 0) closeModifyModal();
  };

  const handleEditClass = (index, newName) => {
    const updatedClasses = [...classes];
    updatedClasses[index].name = newName;
    setClasses(updatedClasses);
  };

  const handleSaveChanges = () => {
    setClasses(classes);
    showToastMessage('Changes saved successfully!', 'success');
    closeModifyModal();
  };

  const handleRegionClick = (region) => {
    setSelectedRegion(region);  // Set the selected region
    onRegionSelect(region);  // Pass selected region data back to parent (if needed)
  };

  return (
    <div className="class-manager">
      <div className="class-header">
        <h2>Classes</h2>
      </div>

      <div className="class-list">
        {classes.length === 0 ? (
          <div className="class-item-placeholder">
            <span className="class-name">Add Your New Class</span>
          </div>
        ) : (
          classes.map((cls) => (
            <div key={cls.count} className="class-item">
              <span className="class-name">{cls.name}</span>
              <span className="class-details">{cls.count}</span>
            </div>
          ))
        )}
      </div>

      <div className="action-buttons">
        <button className="add-button" onClick={openAddModal}>Add</button>
        <button className="modify-button" onClick={openModifyModal} disabled={classes.length === 0}>
          Modify
        </button>
      </div>

      {toast.visible && (
        <div className={`toast-message ${toast.type}`}>{toast.message}</div>
      )}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="modal-close" onClick={closeAddModal}>&times;</span>
            <h3 style={{ color: 'black' }}>Create New Class</h3>
            <input
              type="text"
              className="modal-input"
              placeholder="Enter class name"
              value={newClassInput}
              onChange={(e) => setNewClassInput(e.target.value)}
            />
            <div className="modal-footer">
              <button className="save-button" onClick={addNewClass}>Save</button>
            </div>
          </div>
        </div>
      )}

      {showModifyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="modal-close" onClick={closeModifyModal}>&times;</span>
            <h3 className="modal-title">Modify Classes</h3>
            <p className="modal-description">
              Update or delete class labels. This action cannot be undone.
            </p>
            <div className="modal-divider" />
            <div className="modify-class-list">
              {classes.map((cls, i) => (
                <div key={cls.count} className="class-item">
                  <input
                    type="text"
                    className="edit-class-input"
                    value={cls.name}
                    onChange={(e) => handleEditClass(i, e.target.value)}
                  />
                  <button
                    className="delete-button"
                    onClick={() => handleRemoveClass(i)}
                  >
                    {trashIcon}
                  </button>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="save-button" onClick={handleSaveChanges}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Display selected region's data */}
      {selectedRegion && (
        <div className="selected-region">
          <h3>Selected Region: {selectedRegion.name}</h3>
          <p>Shape: {selectedRegion.shape}</p>
          <p>Coordinates: {JSON.stringify(selectedRegion.coordinates)}</p>
        </div>
      )}
    </div>
  );
};

export default ClassManager;
