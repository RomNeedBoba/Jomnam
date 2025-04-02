import React, { useState, useEffect, useRef } from 'react';

const RectangleDrawer = ({ imageRef, onAddRegion }) => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [drawnRects, setDrawnRects] = useState([]);
  const [selectedRectId, setSelectedRectId] = useState(null);
  const [dragOffset, setDragOffset] = useState(null);

  const containerRef = useRef();

  const handleMouseDown = (e) => {
    if (e.button !== 0 || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking inside existing rect for move
    const hit = drawnRects.find(r => (
      x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height
    ));

    if (hit) {
      setSelectedRectId(hit.id);
      setDragOffset({ x: x - hit.x, y: y - hit.y });
    } else {
      setStart({ x, y });
      setEnd(null);
      setSelectedRectId(null);
    }
  };

  const handleMouseMove = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (start && !dragOffset) {
      setEnd({ x, y });
    } else if (dragOffset && selectedRectId) {
      setDrawnRects(prev => prev.map(r => r.id === selectedRectId ? {
        ...r,
        x: x - dragOffset.x,
        y: y - dragOffset.y,
      } : r));
    }
  };

  const handleMouseUp = () => {
    if (start && end) {
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);
      const width = Math.abs(end.x - start.x);
      const height = Math.abs(end.y - start.y);

      if (width > 5 && height > 5) {
        const shape = {
          id: Date.now(),
          x,
          y,
          width,
          height,
        };

        setDrawnRects(prev => [...prev, shape]);

        const vggFormat = {
          name: 'rect',
          x: Math.round(x),
          y: Math.round(y),
          width: Math.round(width),
          height: Math.round(height),
        };

        onAddRegion({
          shape_attributes: vggFormat,
          description: '',
        });
      }
    }
    setStart(null);
    setEnd(null);
    setDragOffset(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setStart(null);
      setEnd(null);
    }
  };

  useEffect(() => {
    const node = containerRef.current;
    if (node) node.addEventListener('keydown', handleKeyDown);
    return () => {
      if (node) node.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const renderResizeDots = (x, y, width, height) => {
    const dotStyle = (left, top) => ({
      position: 'absolute',
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'white',
      border: '2px solid red',
      left: `${left - 4}px`,
      top: `${top - 4}px`,
      cursor: 'nwse-resize',
      zIndex: 20,
    });

    return (
      <>
        <div style={dotStyle(x, y)} />
        <div style={dotStyle(x + width, y)} />
        <div style={dotStyle(x, y + height)} />
        <div style={dotStyle(x + width, y + height)} />
      </>
    );
  };

  const rect = start && end ? {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  } : null;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 10,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Drawing preview */}
      {rect && (
        <div
          style={{
            position: 'absolute',
            border: '2px dashed red',
            left: `${rect.x}px`,
            top: `${rect.y}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Render saved rectangles */}
      {drawnRects.map(rect => (
        <div key={rect.id}>
          <div
            style={{
              position: 'absolute',
              border: '2px solid red',
              left: `${rect.x}px`,
              top: `${rect.y}px`,
              width: `${rect.width}px`,
              height: `${rect.height}px`,
              background: 'rgba(255, 0, 0, 0.1)',
              pointerEvents: 'none',
            }}
          />
          {renderResizeDots(rect.x, rect.y, rect.width, rect.height)}
        </div>
      ))}
    </div>
  );
};

export default RectangleDrawer;
