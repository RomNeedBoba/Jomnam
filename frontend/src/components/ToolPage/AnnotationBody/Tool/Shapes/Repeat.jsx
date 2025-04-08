import { useEffect } from 'react';

const RepeatTool = ({ activeTool, regions, setRegions, selectedImage }) => {
  useEffect(() => {
    if (activeTool !== 'repeat' || !selectedImage) return;

    const imageName = selectedImage.name;
    const current = regions[imageName] || [];
    if (current.length === 0) return;

    const last = current[current.length - 1];
    const newId = Date.now();
    const offset = 10; // slight offset to see it's a duplicate

    let newShape = null;
    if (last.shape === 'rect') {
      newShape = {
        id: newId,
        shape: 'rect',
        x: last.x + offset,
        y: last.y + offset,
        width: last.width,
        height: last.height,
      };
    } else if (last.shape === 'polygon') {
      newShape = {
        id: newId,
        shape: 'polygon',
        points: last.points.map(p => ({ x: p.x + offset, y: p.y + offset })),
      };
    }

    if (newShape) {
      setRegions(prev => ({
        ...prev,
        [imageName]: [...(prev[imageName] || []), newShape],
      }));
    }
  }, [activeTool]);

  return null;
};

export default RepeatTool;
