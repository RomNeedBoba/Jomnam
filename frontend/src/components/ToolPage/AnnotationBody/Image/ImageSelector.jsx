import React, { useState, useRef } from 'react';
import './Image.css';

const ImageSelector = ({ images, onSelectImage, onAddImages, selectedImage }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState('');
  const fileInputRef = useRef(null);

  const handleAddFiles = (e) => {
    const files = Array.from(e.target.files).filter(file => file.type.startsWith("image/"));
    if (files.length > 0) {
      onAddImages(files); // send only images, no JSON
      setMessageText(`✅ ${files.length} image(s) added`);
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
      {showMessage && <div className="popup-success">{messageText}</div>}

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

      <div className="image-file-list">
        {filteredImages.map((img, i) => (
          <div
            key={i}
            className={`image-file-item ${selectedImage?.name === img.name ? 'selected' : ''}`}
            onClick={() => onSelectImage(img)}
          >
            <span className="file-label">File [{i + 1}]</span> {img.name}
          </div>
        ))}
      </div>

      <div className="add-files-button">
        <input
          type="file"
          multiple
          accept="image/*"
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
