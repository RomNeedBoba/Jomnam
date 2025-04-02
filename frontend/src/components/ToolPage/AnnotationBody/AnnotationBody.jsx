// === AnnotationBody.jsx ===
import React, { useState, useRef } from 'react';
import ImageSelector from './ImageSelector';
import ClassManager from './ClassManager';
import RegionToolbar from './tool';
import RectangleDrawer from './RectangleDrawer';
import RegionList from './RegionList';
import './AnnotationBody.css';

const AnnotationBody = ({
  images,
  selectedImage,
  onSelectImage,
  onAddImages,
  onDeleteImage,
}) => {
  const [crosshair, setCrosshair] = useState({ x: 0, y: 0, visible: false });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [regions, setRegions] = useState([]);

  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    setCrosshair({ x, y, visible: true });
    handlePan(e);
  };

  const handleMouseLeave = () => {
    setCrosshair((prev) => ({ ...prev, visible: false }));
    setDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.min(3, Math.max(0.2, prev + delta)));
  };

  const handleMouseDown = (e) => {
    if (activeTool === 'hand') {
      setDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setDragStart(null);
  };

  const handlePan = (e) => {
    if (dragging && dragStart) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleToolSelect = (tool) => {
    setActiveTool(tool);
  };

  const handleAddRegion = (vggFormatText) => {
    if (!selectedClass) {
      alert("Please select a class before labeling.");
      return;
    }

    const newRegion = {
      id: Date.now(),
      class: selectedClass,
      shape: 'rect',
      data: vggFormatText,
      imageName: selectedImage.name,
    };

    setRegions((prev) => [...prev, newRegion]);
    console.log("💾 Region added:", newRegion);
  };

  const getCursorClass = () => {
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
          <>
            <div
              className={`image-display-container ${getCursorClass()}`}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onWheel={handleWheel}
            >
              {crosshair.visible && (
                <>
                  <div className="crosshair-line vertical" style={{ left: `${crosshair.x}px` }} />
                  <div className="crosshair-line horizontal" style={{ top: `${crosshair.y}px` }} />
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
                  <RectangleDrawer imageRef={imageRef} onAddRegion={handleAddRegion} />
                )}
              </div>
            </div>

            <RegionList
              regions={regions}
              currentImage={selectedImage}
              selectedClass={selectedClass}
              onSelectClass={setSelectedClass}
            />
          </>
        )}

        <RegionToolbar
          activeTool={activeTool}
          onSelectShape={handleToolSelect}
          onDeleteImage={onDeleteImage}
          onDetect={() => alert('Auto annotation coming soon')}
        />
      </div>
    </div>
  );
};

export default AnnotationBody;