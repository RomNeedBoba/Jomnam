import React, { useState } from 'react';
import ImageSelector from './ImageSelector';
import ClassManager from './ClassManager'; // To be created next

const AnnotationBody = ({ images, onImport, onExport }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [classes, setClasses] = useState([]); // List of annotation classes

  return (
    <div className="annotation-body">
      {/* Left Tool Section */}
      <div className="tool-section">
        <ImageSelector
          images={images}
          currentImage={selectedImage}
          onSelectImage={setSelectedImage}
          onImport={onImport}
          onExport={onExport}
        />

        <ClassManager
          classes={classes}
          setClasses={setClasses}
        />
      </div>

      {/* Right Image Display Section */}
      <div className="workspace-section">
        {selectedImage ? (
          <img src={selectedImage.url} alt={selectedImage.name} className="annotation-image" />
        ) : (
          <p>Select an image to begin annotation</p>
        )}
      </div>
    </div>
  );
};

export default AnnotationBody;
