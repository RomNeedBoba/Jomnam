import React, { useState, useEffect } from 'react';
import ImageSelector from '../AnnotationBody/Image/ImageSelector';
import ClassManager from '../AnnotationBody/Class/Class';
import RegionToolbar from '../AnnotationBody/Tool/Tool';
import RectangleDrawer from '../AnnotationBody/Tool/Shapes/Rect';
import PolygonDrawer from '../AnnotationBody/Tool/Shapes/Polygon';
import useImageTransform from '../../../hook/useImageTransform';
import { removeImageFromAnnotations, ensureImageInAnnotations } from '../../../utils/annotationStorage';
import { addDeletedImage } from '../../../utils/deletedImages';

import './AnnotationBody.css';

const AnnotationBody = ({ images, selectedImage, onSelectImage, onAddImages, onDeleteImage }) => {
  const [crosshair, setCrosshair] = useState({ x: 0, y: 0, visible: false });
  const [activeTool, setActiveTool] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [regions, setRegions] = useState({});

  const {
    zoom,
    offset,
    imageRef,
    handleWheel,
    handleMouseDown,
    handleMouseUp,
    handlePan,
    dragging,
  } = useImageTransform(activeTool);

  // ✅ Sync each image with annotationsPreview (only adds if missing)
  useEffect(() => {
    if (selectedImage && !images.some(img => img.name === selectedImage.name)) {
      onSelectImage(null);
    }

    images.forEach(img => {
      ensureImageInAnnotations(img.name, img.fileSize || 0); // <-- fileSize must come from Tool.jsx
    });
  }, [images, selectedImage, onSelectImage]);

  const handleMouseMove = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    setCrosshair({ x, y, visible: true });
    if (activeTool === 'hand') handlePan(e);
  };

  const handleMouseLeave = () => {
    setCrosshair(prev => ({ ...prev, visible: false }));
  };

  const handleToolSelect = (tool) => {
    setActiveTool(tool);
  };

  const handleAddRegion = (vgg) => {
    if (!selectedClass || !selectedImage) {
      alert("Select both image and class.");
      return;
    }

    const newRegion = {
      region_id: Date.now(),
      shape_attributes: vgg.shape_attributes,
      region_attributes: {
        class: selectedClass,
        description: vgg.description || '',
      },
      imageName: selectedImage.name,
    };

    setRegions(prev => ({
      ...prev,
      [selectedImage.name]: [...(prev[selectedImage.name] || []), newRegion],
    }));

    console.log("💾 Region added:", newRegion);
  };

  const handleDeleteImage = () => {
    if (selectedImage) {
      const filename = selectedImage.name;

      removeImageFromAnnotations(filename);     // ✅ Remove from annotationsPreview
      addDeletedImage(filename);                // ✅ Add to Deleted Images
      onDeleteImage(selectedImage);             // ✅ Remove from React state

      const remaining = images.filter(img => img.name !== filename);
      onSelectImage(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const getCursor = () => {
    if (activeTool === 'hand') return dragging ? 'grabbing' : 'grab';
    if (activeTool === 'rect') return 'cursor-rect';
    if (activeTool === 'polygon') return 'cursor-polygon';
    return '';
  };

  return (
    <div className="annotation-body">
      <div className="tool-section">
        <div className="image-selector-box">
          <ImageSelector
            images={images}
            onSelectImage={onSelectImage}
            selectedImage={selectedImage}
            onAddImages={onAddImages}
          />
        </div>
        <div className="class-manager-box">
          <ClassManager onSelectClass={setSelectedClass} />
        </div>
      </div>

      <div className="workspace-section">
        {selectedImage && (
          <div
            className={`image-display-container ${getCursor()}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseDown={activeTool === 'hand' ? handleMouseDown : null}
            onMouseUp={activeTool === 'hand' ? handleMouseUp : null}
            onWheel={handleWheel}
          >
            {crosshair.visible && (
              <>
                <div className="crosshair-line" style={{ left: `${crosshair.x}px` }} />
                <div className="crosshair-line" style={{ top: `${crosshair.y}px` }} />
              </>
            )}
            <div
              className="image-zoom-wrapper"
              ref={imageRef}
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                transition: dragging ? 'none' : 'transform 0.1s ease-out',
              }}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="annotation-image"
                draggable={false}
              />
              {activeTool === 'rect' && (
                <RectangleDrawer
                  imageRef={imageRef}
                  onAddRegion={handleAddRegion}
                  activeTool={activeTool}
                />
              )}
              {activeTool === 'polygon' && (
                <PolygonDrawer
                  imageRef={imageRef}
                  onAddRegion={handleAddRegion}
                  activeTool={activeTool}
                />
              )}
            </div>
          </div>
        )}
        <RegionToolbar
          activeTool={activeTool}
          onSelectShape={handleToolSelect}
          onDeleteImage={handleDeleteImage}
          onDetect={() => alert('Auto annotation coming soon')}
        />
      </div>
    </div>
  );
};

export default AnnotationBody;
