import React, { useEffect } from 'react';
import './Tool.css';

const RegionToolbar = ({ activeTool, onSelectShape, onDetect, onDeleteImage }) => {
  const getButtonClass = (toolName, isDelete = false) => {
    let base = 'icon-button';
    if (isDelete) return base + ' delete-button'; // Don't highlight delete
    return activeTool === toolName ? `${base} active` : base;
  };

  useEffect(() => {
    const toolbarContainer = document.querySelector('.image-display-container');
    if (activeTool === 'hand') {
      toolbarContainer.classList.add('cursor-hand');
      toolbarContainer.classList.remove('cursor-rect', 'cursor-polygon');
    } else if (activeTool === 'rect') {
      toolbarContainer.classList.add('cursor-rect');
      toolbarContainer.classList.remove('cursor-hand', 'cursor-polygon');
    } else if (activeTool === 'polygon') {
      toolbarContainer.classList.add('cursor-polygon');
      toolbarContainer.classList.remove('cursor-hand', 'cursor-rect');
    }
  }, [activeTool]);

  return (
    <div className="region-toolbar">
      <button
        className={getButtonClass('hand')}
        onClick={() => onSelectShape('hand')}
      >
        <img src="/public/hand.svg" alt="Hand Tool" width="24" height="24" />
        <span className="tooltip">Hand (H)</span>
      </button>

      <span className="separator">|</span>

      <button
        className={getButtonClass('rect')}
        onClick={() => onSelectShape('rect')}
      >
        <img src="/public/bounding.svg" alt="Bounding Box" width="24" height="24" />
        <span className="tooltip">Bounding Box (B)</span>
      </button>

      <button
        className={getButtonClass('polygon')}
        onClick={() => onSelectShape('polygon')}
      >
        <img src="/public/polygon.svg" alt="Polygon" width="24" height="24" />
        <span className="tooltip">Polygon (P)</span>
      </button>

      <span className="separator">|</span>

      <button
        className={getButtonClass('ai')}
        onClick={onDetect}
      >
        <img src="/public/ai.svg" alt="AI" width="24" height="24" />
        <span className="tooltip">Automated Annotation (A)</span>
      </button>

      <button
        className={getButtonClass('repeat')}
        onClick={() => onSelectShape('repeat')}
      >
        <img src="/public/repeat.svg" alt="Repeat" width="24" height="24" />
        <span className="tooltip">Repeat Shape (R)</span>
      </button>

      <span className="separator">|</span>

      <button
        className={getButtonClass('', true)}
        onClick={onDeleteImage}
      >
        <img src="/public/trash.svg" alt="Delete" width="24" height="24" />
        <span className="tooltip">Delete Current Image</span>
      </button>
    </div>
  );
};

export default RegionToolbar;
