import React, { useState, useEffect } from 'react';
import axios from 'axios'; // ✅ NEW: Axios for Go backend
import ImageSelector from '../AnnotationBody/Image/ImageSelector';
import ClassManager from '../AnnotationBody/Class/Class';
import RegionToolbar from '../AnnotationBody/Tool/Tool';
import ShapeDrawer from '../AnnotationBody/Tool/Shapes/ShapeDrawer';
import RepeatTool from '../AnnotationBody/Tool/Shapes/Repeat';
import RegionEditorOverlay from '../AnnotationBody/Class/RegionEditor';
import useImageTransform from '../../../hook/useImageTransform';
import { removeImageFromAnnotations, ensureImageInAnnotations } from '../../../utils/annotationStorage';
import { addDeletedImage } from '../../../utils/deletedImages';
import '../../../styles/ToolBody.css';

const AnnotationBody = ({ images, selectedImage, onSelectImage, onAddImages, onDeleteImage }) => {
  const [crosshair, setCrosshair] = useState({ x: 0, y: 0, visible: false });
  const [activeTool, setActiveTool] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [regions, setRegions] = useState({});
  const [classList, setClassList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

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

  const selectedRegion = selectedImage
    ? (regions[selectedImage.name] || []).find(r => r.id === selectedId)
    : null;

  const updateRegion = (id, updateFn) => {
    if (!selectedImage) return;
    setRegions(prev => ({
      ...prev,
      [selectedImage.name]: prev[selectedImage.name].map(r => (r.id === id ? updateFn(r) : r)),
    }));
  };

  const deleteRegion = (id) => {
    if (!selectedImage) return;
    setRegions(prev => ({
      ...prev,
      [selectedImage.name]: prev[selectedImage.name].filter(r => r.id !== id),
    }));
    setSelectedId(null);
  };

  const handleClassListUpdate = (updatedList) => {
    setClassList(updatedList);
  };

  useEffect(() => {
    if (selectedImage && !images.some(img => img.name === selectedImage.name)) {
      onSelectImage(null);
    }

    images.forEach(img => {
      ensureImageInAnnotations(img.name, img.fileSize || 0);
    });

    const raw = localStorage.getItem('annotationsPreview');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const currentNames = new Set(images.map(img => img.name));
        const newFiles = {};
        const newMetadata = {};

        Object.entries(parsed.files || {}).forEach(([fileKey, fileObj]) => {
          if (currentNames.has(fileObj.fname)) {
            newFiles[fileKey] = fileObj;
            Object.entries(parsed.metadata || {}).forEach(([metaKey, meta]) => {
              if (meta.image_id === fileKey) {
                newMetadata[metaKey] = meta;
              }
            });
          }
        });

        localStorage.setItem('annotationsPreview', JSON.stringify({
          files: newFiles,
          metadata: newMetadata,
        }, null, 2));
      } catch (e) {
        console.error("❌ Error syncing annotationsPreview with images:", e);
      }
    }
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
      id: Date.now(),
      shape: vgg.shape_attributes.name,
      ...vgg.shape_attributes,
      region_attributes: {
        class: selectedClass,
        description: vgg.description || '',
      },
    };

    setRegions(prev => ({
      ...prev,
      [selectedImage.name]: [...(prev[selectedImage.name] || []), newRegion],
    }));
  };

  const handleDeleteImage = () => {
    if (!selectedImage) return;
    const filename = selectedImage.name;

    removeImageFromAnnotations(filename);
    addDeletedImage(filename);
    onDeleteImage(selectedImage);

    const remaining = images.filter(img => img.name !== filename);
    onSelectImage(remaining.length > 0 ? remaining[0] : null);

    const raw = localStorage.getItem('annotationsPreview');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const newFiles = {};
        const newMetadata = {};
        const remainingNames = new Set(remaining.map(img => img.name));

        Object.entries(parsed.files || {}).forEach(([fileKey, fileObj]) => {
          if (remainingNames.has(fileObj.fname)) {
            newFiles[fileKey] = fileObj;
            Object.entries(parsed.metadata || {}).forEach(([metaKey, meta]) => {
              if (meta.image_id === fileKey) {
                newMetadata[metaKey] = meta;
              }
            });
          }
        });

        localStorage.setItem('annotationsPreview', JSON.stringify({
          files: newFiles,
          metadata: newMetadata,
        }, null, 2));
      } catch (e) {
        console.error("❌ Failed to clean up annotationsPreview after delete:", e);
      }
    }
  };

  // ✅ Auto-labeling using Go + Python backend
  const handleAutoDetect = async () => {
    if (!selectedImage) return;

    try {
      const response = await fetch(selectedImage.url);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result.split(',')[1]; // Strip prefix

        const res = await axios.post('http://localhost:8080/autolabel', {
          image_base64: base64,
          image_name: selectedImage.name,
        });

        const autoRegions = res.data.regions || [];

        const formatted = autoRegions.map(region => ({
          id: Date.now() + Math.random(),
          shape: 'polygon',
          points: region.points,
          region_attributes: {
            class: region.class || 'auto',
            description: region.description || '',
          },
        }));

        setRegions(prev => ({
          ...prev,
          [selectedImage.name]: [...(prev[selectedImage.name] || []), ...formatted],
        }));

        console.log("🧠 Auto-labeled:", formatted);
      };

      reader.readAsDataURL(blob);
    } catch (err) {
      console.error("❌ Auto-label error:", err);
      alert("Auto-label failed. Check console.");
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
          <ClassManager
            onSelectClass={setSelectedClass}
            onClassListUpdate={handleClassListUpdate}
          />
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
              <ShapeDrawer
                imageRef={imageRef}
                activeTool={activeTool}
                selectedImage={selectedImage}
                regions={regions}
                setRegions={setRegions}
                onAddRegion={handleAddRegion}
                zoom={zoom}
                offset={offset}
                setSelectedId={setSelectedId}
                classList={classList}
              />
            </div>
          </div>
        )}

        {/* ✅ Injected auto-label feature in toolbar */}
        <RegionToolbar
          activeTool={activeTool}
          onSelectShape={handleToolSelect}
          onDeleteImage={handleDeleteImage}
          onDetect={handleAutoDetect}
        />

        <RepeatTool
          activeTool={activeTool}
          regions={regions}
          setRegions={setRegions}
          selectedImage={selectedImage}
        />
      </div>

      {selectedRegion && (
        <RegionEditorOverlay
          region={selectedRegion}
          classes={classList}
          onUpdate={(updated) => updateRegion(updated.id, () => updated)}
          onDelete={() => deleteRegion(selectedRegion.id)}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
};

export default AnnotationBody;
