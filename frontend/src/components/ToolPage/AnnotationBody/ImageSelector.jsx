import React, { useState, useRef } from 'react';

const ImageSelector = ({ images, onSelectImage, onAddImages, selectedImage }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState('');
  const fileInputRef = useRef(null);

  const handleAddFiles = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    if (imageFiles.length > 0) {
      onAddImages(imageFiles);
      setMessageText(`✅ ${imageFiles.length} image(s) added`);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2500);
    }
  };

  const filteredImages = images.filter(img => {
    const matchFilter = filter === 'all' || !img.annotated;
    const matchSearch = img.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="image-selector-box">
      {/* 📁 Project Header */}
      <div className="project-header">
        <h2>📁 Project</h2>
      </div>

      {/* ✅ Animated Toast */}
      {showMessage && (
        <div className="popup-success">{messageText}</div>
      )}

      {/* Image Controls */}
      <div className="panel-title">Image Selector</div>

      <div className="filter-tools">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Files</option>
          <option value="unannotated">Unannotated</option>
        </select>
        <input
          type="text"
          placeholder="Search Files"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* File List */}
      <div className="image-file-list">
        {filteredImages.map((img, i) => (
          <div
            key={i}
            className={`image-file-item ${selectedImage && selectedImage.name === img.name ? 'selected' : ''}`}
            onClick={() => onSelectImage(img)}
          >
            <span className="file-label">File [{i + 1}]</span> {img.name}
          </div>
        ))}
      </div>

      {/* Add Files Button */}
      <div className="add-files-button">
        <input
          type="file"
          multiple
          accept="image/*"
          webkitdirectory=""
          directory=""
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleAddFiles}
        />
        <button onClick={() => fileInputRef.current.click()}>Add Files</button>
      </div>
    </div>
  );
};

export default ImageSelector;
