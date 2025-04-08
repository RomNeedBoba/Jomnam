import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { getDeletedImages } from '../../../utils/deletedImages';
import { exportJSON } from './export/exportJSON';
import { exportCSV } from './export/exportCSV';
import { exportCOCO } from './export/exportCOCO';
import { previewAnnotation } from './export/previewAnnotation';
import '../../../styles/Menu.css';

const Header = forwardRef((props, ref) => {
  const [projectTitle, setProjectTitle] = useState('Untitled Project');
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [deletedImages, setDeletedImages] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [openSubIndex, setOpenSubIndex] = useState(null);

  useImperativeHandle(ref, () => ({
    updateTitleFromFolder(folderName) {
      if (folderName && projectTitle === 'Untitled Project') {
        setProjectTitle(folderName);
        localStorage.setItem('projectTitle', folderName);
      }
    }
  }));

  useEffect(() => {
    const savedTitle = localStorage.getItem("projectTitle");
    if (savedTitle) setProjectTitle(savedTitle);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.menu-item')) {
        setOpenMenuIndex(null);
        setOpenSubIndex(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleTitleClick = () => {
    const newTitle = prompt("Enter new project title:", projectTitle);
    if (newTitle?.trim()) {
      setProjectTitle(newTitle);
      localStorage.setItem("projectTitle", newTitle);
    }
  };

  const openDeletedModal = () => {
    const files = getDeletedImages();
    setDeletedImages(files);
    setShowDeletedModal(true);
  };

  const handleMenuClick = (item) => {
    switch (item) {
      case "Preview Annotation": return previewAnnotation(projectTitle);
      case "Export as CSV": return exportCSV(projectTitle);
      case "Export as JSON": return exportJSON(projectTitle);
      case "Export as COCO": return exportCOCO(projectTitle);
      case "View Deleted Images": return openDeletedModal();
      default: return;
    }
  };
  

  const menuData = [
    {
      label: "File",
      items: [
        { label: "Open From", subItems: ["Google Drive...", "One Drive...", "Local Drive..."] },
        "divider", "Save", "Save as..."
      ]
    },
    {
      label: "Annotation",
      items: [
        { label: "Export", subItems: ["Export as JSON", "Export as CSV", "Export as COCO"] },
        { label: "Import", subItems: ["Import from JSON", "Import from CSV", "Import as COCO"] },
        "divider", "Preview Annotation"
      ]
    },
    { label: "View", items: ["View Deleted Images"] },
    { label: "Help", items: ["Documentation", "About"] }
  ];

  return (
    <>
      <header className="header">
        <div className="logo"><img src="/src/assets/golo.png" alt="Logo" /></div>
        <div className="title-menu-container">
          <div className="title" id="projectTitle" onClick={handleTitleClick} title="Click to rename project">
            {projectTitle}
          </div>
          <nav className="menu">
            {menuData.map((menu, index) => (
              <div
                className={`menu-item ${openMenuIndex === index ? 'open' : ''}`}
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuIndex(openMenuIndex === index ? null : index);
                  setOpenSubIndex(null);
                }}
              >
                {menu.label}
                <ul className="dropdown">
                  {menu.items.map((item, idx) => {
                    if (item === "divider") return <hr key={idx} />;
                    if (typeof item === "string") {
                      return <li key={idx} onClick={(e) => { e.stopPropagation(); handleMenuClick(item); }}>{item}</li>;
                    } else {
                      return (
                        <li
                          key={idx}
                          className={`has-submenu ${openSubIndex === `${index}-${idx}` ? 'open' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenSubIndex(openSubIndex === `${index}-${idx}` ? null : `${index}-${idx}`);
                          }}
                        >
                          {item.label}<span className="chevron">→</span>
                          <ul className="nested-dropdown">
                            {item.subItems.map((sub, subIdx) => (
                              <li key={subIdx} onClick={(e) => { e.stopPropagation(); handleMenuClick(sub); }}>{sub}</li>
                            ))}
                          </ul>
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </header>

      {showDeletedModal && (
        <div className="deleted-modal-overlay">
          <div className="deleted-modal">
            <span className="close-btn" onClick={() => setShowDeletedModal(false)}>&times;</span>
            <h3>🗑️ Deleted Images</h3>
            <ul className="deleted-list">
              {deletedImages.length === 0
                ? <li style={{ color: '#888' }}>No images deleted.</li>
                : deletedImages.map((file, idx) => <li key={idx}>{file}</li>)}
            </ul>
          </div>
        </div>
      )}
    </>
  );
});

export default Header;
