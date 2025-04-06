import React, { useState, useEffect, useRef } from 'react';

const RectangleDrawer = ({ imageRef, onAddRegion, activeTool }) => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [rectangles, setRectangles] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const [resizing, setResizing] = useState(null); 
  const [offset, setOffset] = useState(null);

  const containerRef = useRef();

  // Handle mouse down for drawing or resizing
  const handleMouseDown = (e) => {
    if (!imageRef.current || e.button !== 0 || activeTool !== 'rect') return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if it's a resize action
    for (const r of rectangles) {
      const corners = getResizeDots(r);
      for (let corner of Object.keys(corners)) {
        const dot = corners[corner];
        if (Math.abs(dot.x - x) < 6 && Math.abs(dot.y - y) < 6) {
          setResizing({ id: r.id, corner });
          return;
        }
      }
    }

    // Check if it's a drag action
    const hit = rectangles.find(r =>
      x >= r.x && x <= r.x + r.width &&
      y >= r.y && y <= r.y + r.height
    );
    if (hit) {
      setDraggingId(hit.id);
      setOffset({ x: x - hit.x, y: y - hit.y });
      return;
    }

    // Start new drawing
    setStart({ x, y });
    setEnd(null);
  };

  // Handle mouse move for drawing or resizing
  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (start) {
      setEnd({ x, y });
    } else if (resizing) {
      setRectangles(prev =>
        prev.map(r => {
          if (r.id !== resizing.id) return r;
          const updated = { ...r };

          // Handle resizing
          if (resizing.corner.includes('right')) {
            updated.width = Math.max(5, x - updated.x);
          }
          if (resizing.corner.includes('bottom')) {
            updated.height = Math.max(5, y - updated.y);
          }
          if (resizing.corner.includes('left')) {
            const diff = updated.x - x;
            updated.x = x;
            updated.width += diff;
          }
          if (resizing.corner.includes('top')) {
            const diff = updated.y - y;
            updated.y = y;
            updated.height += diff;
          }

          return updated;
        })
      );
    } else if (draggingId !== null && offset) {
      setRectangles(prev =>
        prev.map(r => r.id === draggingId ? {
          ...r,
          x: x - offset.x,
          y: y - offset.y
        } : r)
      );
    }
  };

  // Handle mouse up after drawing or resizing
  const handleMouseUp = () => {
    if (start && end) {
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);
      const width = Math.abs(start.x - end.x);
      const height = Math.abs(start.y - end.y);

      if (width >= 5 && height >= 5) {
        const newRect = { id: Date.now(), x, y, width, height };
        setRectangles(prev => [...prev, newRect]);

        // Notify parent to store the region data
        onAddRegion({
          shape_attributes: {
            name: 'rect',
            x: Math.round(x),
            y: Math.round(y),
            width: Math.round(width),
            height: Math.round(height)
          },
          description: ''
        });
      }
    }
    setStart(null);
    setEnd(null);
    setDraggingId(null);
    setResizing(null);
  };

  // Handle Escape key to reset drawing
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setStart(null);
      setEnd(null);
    }
  };

  // Get resize dots positions for the rectangle corners
  const getResizeDots = (r) => ({
    topleft: { x: r.x, y: r.y },
    topright: { x: r.x + r.width, y: r.y },
    bottomleft: { x: r.x, y: r.y + r.height },
    bottomright: { x: r.x + r.width, y: r.y + r.height }
  });

  // Attach the keydown event
  useEffect(() => {
    const node = containerRef.current;
    if (node) node.addEventListener('keydown', handleKeyDown);
    return () => {
      if (node) node.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Render resize dots on the rectangle
  const renderResizeDots = (rect) => {
    const dots = getResizeDots(rect);
    return Object.entries(dots).map(([corner, pos]) => (
      <div
        key={corner}
        onMouseDown={(e) => {
          e.stopPropagation();
          setResizing({ id: rect.id, corner });
        }}
        style={{
          position: 'absolute',
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: 'white',
          border: '2px solid red',
          left: `${pos.x - 4}px`,
          top: `${pos.y - 4}px`,
          cursor: corner.includes('left') ? (corner.includes('top') ? 'nwse-resize' : 'nesw-resize') : (corner.includes('top') ? 'nesw-resize' : 'nwse-resize'),
          zIndex: 20
        }}
      />
    ));
  };

  // Preview rectangle while drawing
  const preview = start && end ? {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(start.x - end.x),
    height: Math.abs(start.y - end.y),
  } : null;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {preview && (
        <div
          style={{
            position: 'absolute',
            border: '2px dashed red',
            left: preview.x,
            top: preview.y,
            width: preview.width,
            height: preview.height,
            pointerEvents: 'none'
          }}
        />
      )}

      {rectangles.map((rect) => (
        <div key={rect.id}>
          <div
            style={{
              position: 'absolute',
              left: rect.x,
              top: rect.y,
              width: rect.width,
              height: rect.height,
              border: '2px solid red',
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              cursor: 'move',
            }}
          />
          {renderResizeDots(rect)}
        </div>
      ))}
    </div>
  );
};

export default RectangleDrawer;
