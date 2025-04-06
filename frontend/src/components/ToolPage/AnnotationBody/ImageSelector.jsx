import React, { useState, useRef } from 'react';
import JsonPathModal from './JsonPathModal'; // ✅ Import modal
import './AnnotationBody.css';

const ImageSelector = ({ images, onSelectImage, onAddImages, selectedImage }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [showJsonModal, setShowJsonModal] = useState(false);
  const fileInputRef = useRef(null);
  const pendingFilesRef = useRef([]);

  // Handle file selection from the file input
  const handleAddFiles = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith("image/"));

    if (imageFiles.length > 0) {
      pendingFilesRef.current = imageFiles;
      setShowJsonModal(true); // Show modal to choose where to store JSON
    }
  };

  // Confirm JSON path for storing data
  const handleJsonPathConfirm = async (fileHandle) => {
    const imageFiles = pendingFilesRef.current;
    onAddImages(imageFiles, fileHandle); // Pass image files and JSON path/file handle up to parent
    setMessageText(`✅ ${imageFiles.length} image(s) added`);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2500); // Show success message for 2.5 seconds
    setShowJsonModal(false); // Close the modal after selection
    pendingFilesRef.current = []; // Clear pending files
  };

  // Cancel JSON path selection
  const handleJsonPathCancel = () => {
    pendingFilesRef.current = [];
    setShowJsonModal(false);
  };

  // Filter images based on the selected filter and search input
  const filteredImages = images.filter(img => {
    const matchFilter = filter === 'all' || !img.annotated;
    const matchSearch = img.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="image-selector-box">
      {/* Success message display */}
      {showMessage && (
        <div className="popup-success">{messageText}</div>
      )}

      <div className="panel-title">Image Selector</div>

      <div className="filter-tools">
        {/* Filter by annotated or not */}
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Files</option>
          <option value="unannotated">Unannotated</option>
        </select>
        
        {/* Search input */}
        <input
          type="text"
          placeholder="Search Files"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="image-file-list">
        {/* Render the filtered images list */}
        {filteredImages.map((img, i) => (
          <div
            key={i}
            className={`image-file-item ${selectedImage && selectedImage.name === img.name ? 'selected' : ''}`}
            onClick={() => onSelectImage(img)} // Select an image when clicked
          >
            <span className="file-label">File [{i + 1}]</span> {img.name}
          </div>
        ))}
      </div>

      <div className="add-files-button">
        {/* Hidden file input button */}
        <input
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleAddFiles}
        />
        {/* Button to trigger file input */}
        <button onClick={() => fileInputRef.current.click()}>Add Files</button>
      </div>

      {/* JSON Path Modal Overlay */}
      {showJsonModal && (
        <JsonPathModal
          onConfirm={handleJsonPathConfirm}
          onCancel={handleJsonPathCancel}
        />
      )}
    </div>
  );
};

export default ImageSelector;
