// /src/hooks/useImageTransform.js
import { useState, useRef } from 'react';

const useImageTransform = (activeTool) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const imageRef = useRef(null);

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

  return { zoom, offset, imageRef, handleWheel, handleMouseDown, handleMouseUp, handlePan, dragging };
};

export default useImageTransform;
