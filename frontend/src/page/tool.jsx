import React, { useState, useEffect, useRef } from 'react';
import Popup from '../components/popup/database/database'; 
import Header from "../components/ToolPage/Menu/Menu";
import AnnotationBody from "../components/ToolPage/AnnotationBody/AnnotationBody";
import { addDeletedImage } from '../utils/deletedImages';
import { removeImageFromAnnotations, ensureImageInAnnotations } from '../utils/annotationStorage';
import '../styles/ToolPage.css';

const Tool = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [toast, setToast] = useState(null); 
  const headerRef = useRef();

  useEffect(() => {
    localStorage.removeItem('projectTitle');
    localStorage.removeItem('deletedImages');
    localStorage.removeItem('annotationsPreview');
    setShowPopup(true);
  }, []);

  const closePopup = () => setShowPopup(false);

  const handleAddImages = (fileList) => {
    const imageFiles = fileList.filter(file => file.type.startsWith("image/"));

    if (imageFiles.length > 0) {
      const folderPath = imageFiles[0].webkitRelativePath || "";
      const folderName = folderPath.split("/")[0];
      if (folderName && headerRef.current) {
        headerRef.current.updateTitleFromFolder(folderName);
      }
    }

    Promise.all(imageFiles.map((file, index) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            name: file.webkitRelativePath || file.name,
            file_id: `file${index + 1}`,
            fileSize: file.size || 0,
            url: reader.result,
            annotated: false
          });
        };
        reader.readAsDataURL(file);
      });
    })).then((newImages) => {
      setImages(prev => {
        const existingNames = new Set(prev.map(img => img.name));
        const combined = [...prev];
        newImages.forEach(img => {
          if (!existingNames.has(img.name)) {
            combined.push(img);
            ensureImageInAnnotations(img.file_id, img.name, img.fileSize); // 🔁 Sync to annotationsPreview
          }
        });
        return combined;
      });
    });
  };

  const handleSelectImage = (image) => setSelectedImage(image);

  const handleDeleteCurrentImage = () => {
    if (!selectedImage) return;

    const { name } = selectedImage;
    addDeletedImage(name);
    removeImageFromAnnotations(name);

    setImages(prevImages => {
      const updated = prevImages.filter(img => img.name !== name);
      const newSelected = updated.length > 0
        ? updated[Math.min(prevImages.findIndex(img => img.name === name), updated.length - 1)]
        : null;
      setSelectedImage(newSelected);
      return updated;
    });

    setToast("⚠️ Image removed from browser. Your local file is not deleted.");
    setTimeout(() => setToast(null), 8000);
  };

  return (
    <div className="app">
      <Header ref={headerRef} />
      {showPopup && <Popup closePopup={closePopup} onAddImages={handleAddImages} />}
      {toast && <div className="warning-toast">{toast}</div>}
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
