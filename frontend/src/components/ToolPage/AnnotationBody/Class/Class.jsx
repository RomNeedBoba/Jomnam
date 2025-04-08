import React, { useState, useEffect } from 'react';
import './Class.css';

const trashIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 3V4H4V6H5V19C5 20.65 6.35 22 8 22H16C17.65 22 19 20.65 19 19V6H20V4H15V3H9ZM7 6H17V19C17 19.55 16.55 20 16 20H8C7.45 20 7 19.55 7 19V6ZM9 8V18H11V8H9ZM13 8V18H15V8H13Z"/>
  </svg>
);

const ClassManager = ({ onSelectClass, onClassListUpdate }) => {
  const [classes, setClasses] = useState([]);
  const [selectedClassIndex, setSelectedClassIndex] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [newClassInput, setNewClassInput] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });

  // Sync external parent state
  useEffect(() => {
    if (onClassListUpdate) {
      onClassListUpdate(classes);
    }
  }, [classes]);

  const openAddModal = () => {
    setNewClassInput('');
    setShowAddModal(true);
  };

  const closeAddModal = () => setShowAddModal(false);
  const closeModifyModal = () => setShowModifyModal(false);

  const showToastMessage = (message, type) => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: '' }), 2500);
  };

  const addNewClass = () => {
    const trimmed = newClassInput.trim();
    if (!trimmed) return showToastMessage('Class name cannot be empty.', 'error');

    const exists = classes.some(cls => cls.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) return showToastMessage('Duplicate class name.', 'error');

    const newList = [...classes, { name: trimmed, count: classes.length + 1 }];
    setClasses(newList);
    setShowAddModal(false);
    showToastMessage('Class added successfully!', 'success');
  };

  const handleRemoveClass = (index) => {
    const updated = classes.filter((_, i) => i !== index).map((cls, i) => ({
      ...cls,
      count: i + 1,
    }));
    setClasses(updated);
    setSelectedClassIndex(null);
    onSelectClass(null);
    showToastMessage('Class removed successfully!', 'success');
    if (updated.length === 0) closeModifyModal();
  };

  const handleEditClass = (index, newName) => {
    const updated = [...classes];
    updated[index].name = newName;
    setClasses(updated);
  };

  const handleSaveChanges = () => {
    showToastMessage('Changes saved successfully!', 'success');
    closeModifyModal();
  };

  const handleClassClick = (index) => {
    setSelectedClassIndex(index);
    onSelectClass(classes[index].name);
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
          classes.map((cls, i) => (
            <div
              key={cls.count}
              className={`class-item ${i === selectedClassIndex ? 'selected' : ''}`}
              onClick={() => handleClassClick(i)}
              title="Click to select this class"
            >
              <span className="class-name">{cls.name}</span>
              <span className="class-details">#{cls.count}</span>
            </div>
          ))
        )}
      </div>

      <div className="action-buttons">
        <button className="add-button" onClick={openAddModal}>Add</button>
        <button className="modify-button" onClick={() => setShowModifyModal(true)} disabled={classes.length === 0}>
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
            <h3>Create New Class</h3>
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
            <h3>Modify Classes</h3>
            <p>Update or delete class labels.</p>
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
                  <button className="delete-button" onClick={() => handleRemoveClass(i)}>
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
    </div>
  );
};

export default ClassManager;
