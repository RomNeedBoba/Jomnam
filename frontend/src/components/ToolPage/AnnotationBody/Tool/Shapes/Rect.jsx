import React from 'react';

const Rect = ({ rect, isSelected, setSelectedId, setResizing, getResizeDots, zoom, offset }) => {
  const drawResizeDots = () => {
    const dots = getResizeDots(rect, zoom, offset);
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
          left: pos.x - 4,
          top: pos.y - 4,
          cursor: corner.includes('left')
            ? corner.includes('top') ? 'nwse-resize' : 'nesw-resize'
            : corner.includes('top') ? 'nesw-resize' : 'nwse-resize',
          zIndex: 20,
        }}
      />
    ));
  };

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: rect.x * zoom + offset.x,
          top: rect.y * zoom + offset.y,
          width: rect.width * zoom,
          height: rect.height * zoom,
          border: '2px solid red',
          backgroundColor: 'rgba(255,0,0,0.1)',
          cursor: 'move',
        }}
        onClick={() => setSelectedId(rect.id)}
      />
      {isSelected && drawResizeDots()}
    </>
  );
};

export default Rect;
