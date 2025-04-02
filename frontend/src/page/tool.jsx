import React, { useState, useEffect } from 'react';
import Popup from '../components/popup/database/database'; 
import Header from "../components/ToolPage/Menu/Menu";
import AnnotationBody from "../components/ToolPage/AnnotationBody/AnnotationBody";
import { saveDeletedImage } from '../utils/deletedImages';
import '../styles/ToolPage.css';

const Tool = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [toast, setToast] = useState(null); 

  useEffect(() => {
    setShowPopup(true);
  }, []);

  const closePopup = () => setShowPopup(false);

  const handleAddImages = (fileList) => {
    const imageFiles = fileList.filter(file => file.type.startsWith("image/"));

    const newImages = imageFiles.map(file => ({
      name: file.webkitRelativePath || file.name,
      url: URL.createObjectURL(file),
      annotated: false,
    }));

    setImages(prev => {
      const existingNames = new Set(prev.map(img => img.name));
      const combined = [...prev];
      newImages.forEach(img => {
        if (!existingNames.has(img.name)) {
          combined.push(img);
        }
      });
      return combined;
    });
  };

  const handleSelectImage = (image) => {
    setSelectedImage(image);
  };

  const handleDeleteCurrentImage = () => {
    if (!selectedImage) return;

    saveDeletedImage(selectedImage.name);
    showToast("⚠️ Image removed from browser. Your local file is not deleted.");

    setImages(prevImages => {
      const updatedImages = prevImages.filter(img => img.url !== selectedImage.url);
      const newSelected =
        updatedImages.length > 0 ? updatedImages[Math.min(prevImages.findIndex(img => img.url === selectedImage.url), updatedImages.length - 1)] : null;
      setSelectedImage(newSelected);
      return updatedImages;
    });
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 8000);
  };

  return (
    <div className="app">
      <Header />
      {showPopup && <Popup closePopup={closePopup} onAddImages={handleAddImages} />}

      {toast && (
        <div className="warning-toast">
          {toast}
        </div>
      )}

      <AnnotationBody
        images={images}
        selectedImage={selectedImage}
        onAddImages={handleAddImages}
        onSelectImage={handleSelectImage}
        onDeleteImage={handleDeleteCurrentImage}
      />
    </div>
  );
};

export default Tool;
