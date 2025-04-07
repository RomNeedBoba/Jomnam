import React, { useState, useEffect, useRef } from 'react';

const ImagePolygonDrawer = ({ imageRef, imageId, onSaveRegion }) => {
  // Points for the current (in-progress) polygon
  const [points, setPoints] = useState([]);
  // Current mouse position for live preview (line from last point to cursor)
  const [preview, setPreview] = useState(null);
  // Array of finalized regions (each with points, description, and class)
  const [regions, setRegions] = useState([]);

  // A ref to focus the container so that it can capture key events (like Enter)
  const containerRef = useRef(null);

  // Auto-focus when the component mounts
  useEffect(() => {
    containerRef.current && containerRef.current.focus();
  }, []);

  // Add a new point on click using imageRef for relative coordinates
  const handleClick = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints(prev => [...prev, { x, y }]);
    // Reset the preview since a new point has been added
    setPreview(null);
  };

  // Update preview on mouse movement
  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPreview({ x, y });
  };

  // Finalize the polygon on Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && points.length > 2) {
      // Use prompt dialogs to gather additional data
      let description = window.prompt("Enter description for this region:", "");
      let regionClass = window.prompt("Enter class label for this region:", "");

      // Set default values if inputs are empty or canceled
      description = description && description.trim() !== "" ? description : "No description";
      regionClass = regionClass && regionClass.trim() !== "" ? regionClass : "unclassified";

      const newRegion = {
        imageId,     // Associate with the specific image
        points,      // Save the x/y coordinates for this region
        description, // User-provided description (or default)
        regionClass, // User-provided class label (or default)
      };

      // Add the finished region to our regions state, so it stays visible
      setRegions(prev => [...prev, newRegion]);
      // Optionally, pass the region back to a parent component
      onSaveRegion && onSaveRegion(newRegion);

      // Save regions in localStorage keyed by the image ID for persistence
      const storedRegions = JSON.parse(localStorage.getItem('regions') || '{}');
      storedRegions[imageId] = storedRegions[imageId]
        ? [...storedRegions[imageId], newRegion]
        : [newRegion];
      localStorage.setItem('regions', JSON.stringify(storedRegions));

      // Clear the current polygon (points and preview) for a new drawing
      setPoints([]);
      setPreview(null);
    }
  };

  // Render the in-progress polygon (using a polyline)
  const renderPolygon = () => {
    if (points.length === 0) return null;
    // Build a space-separated string of coordinate pairs
    const pointString = points.map(p => `${p.x},${p.y}`).join(' ');
    // If a preview point exists, append it so the line follows the cursor
    const previewString = preview ? `${pointString} ${preview.x},${preview.y}` : pointString;
    return (
      <svg style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
        {points.length > 1 && (
          <polyline points={previewString} fill="none" stroke="red" strokeWidth="2" />
        )}
      </svg>
    );
  };

  // Render the vertices of the current polygon as small dots
  const renderPoints = () => {
    return points.map((p, index) => (
      <div
        key={index}
        style={{
          position: 'absolute',
          left: p.x - 4,
          top: p.y - 4,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: 'white',
          border: '2px solid red'
        }}
      />
    ));
  };

  // Render all finalized regions (persisted polygons) on the image
  const renderRegions = () => {
    return regions.map((region, idx) => {
      const pts = region.points.map(p => `${p.x},${p.y}`).join(' ');
      return (
        <svg key={idx} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
          <polygon points={pts} fill="rgba(0,255,0,0.2)" stroke="green" strokeWidth="2" />
        </svg>
      );
    });
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}  // Makes the div focusable to capture key events (like Enter)
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onKeyDown={handleKeyDown}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        cursor: 'crosshair'
      }}
    >
      {renderRegions()}
      {renderPolygon()}
      {renderPoints()}
    </div>
  );
};

export default ImagePolygonDrawer;
