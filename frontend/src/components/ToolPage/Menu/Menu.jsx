import React, { useState, useEffect } from 'react';
import './ToolHeader.css';
import { getDeletedImages } from '../../../utils/deletedImages';

const Header = () => {
  const [projectTitle, setProjectTitle] = useState('Untitled Project');
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [deletedImages, setDeletedImages] = useState([]);

  useEffect(() => {
    const savedTitle = localStorage.getItem("projectTitle");
    if (savedTitle) setProjectTitle(savedTitle);

    const script = document.createElement("script");
    script.src = "/script.js";
    script.async = true;
    script.onload = () => console.log("Script loaded!");
    document.body.appendChild(script);

    return () => console.log("Header unmounted, but script stays.");
  }, []);

  const handleTitleClick = () => {
    const newTitle = prompt("Enter new project title:", projectTitle);
    if (newTitle && newTitle.trim()) {
      setProjectTitle(newTitle);
    }
  };

  const openDeletedModal = () => {
    const files = getDeletedImages();
    setDeletedImages(files);
    setShowDeletedModal(true);
  };

  const menuData = [
    {
      label: "File",
      items: [
        {
          label: "Open From",
          subItems: ["Google Drive...", "One Drive...", "Local Drive..."]
        },
        "divider",
        "Save",
        "Save as..."
      ]
    },
    {
      label: "Annotation",
      items: [
        {
          label: "Export",
          subItems: ["Export as JSON", "Export as CSV", "Export as COCO"]
        },
        {
          label: "Import",
          subItems: ["Import from JSON", "Import from CSV", "Import as COCO"]
        },
        "divider",
        "Preview Annotation"
      ]
    },
    {
      label: "View",
      items: ["View Deleted Images"]
    },
    {
      label: "Help",
      items: ["Documentation", "About"]
    }
  ];

  return (
    <>
      <header className="header">
        <div className="logo">
          <img src="/src/assets/golo.png" alt="Logo" />
        </div>

        <div className="title-menu-container">
          <div className="title" id="projectTitle" onClick={handleTitleClick} title="Click to rename project">
            {projectTitle}
          </div>

          <nav className="menu">
            {menuData.map((menu, index) => (
              <div className="menu-item" key={index}>
                {menu.label}
                <ul className="dropdown">
                  {menu.items.map((item, idx) => {
                    if (item === "divider") return <hr key={idx} />;
                    if (typeof item === "string") {
                      return (
                        <li key={idx} onClick={item === "View Deleted Images" ? openDeletedModal : null}>
                          {item}
                        </li>
                      );
                    } else {
                      return (
                        <li key={idx}>
                          {item.label}
                          <span className="chevron">→</span>
                          <ul className="nested-dropdown">
                            {item.subItems.map((sub, subIdx) => (
                              <li key={subIdx}>{sub}</li>
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

      {/* Modal for Deleted Images */}
      {showDeletedModal && (
        <div className="deleted-modal-overlay">
          <div className="deleted-modal">
            <span className="close-btn" onClick={() => setShowDeletedModal(false)}>&times;</span>
            <h3>🗑️ Deleted Images</h3>
            <ul className="deleted-list">
              {deletedImages.length === 0 ? (
                <li style={{ color: '#888' }}>No images deleted.</li>
              ) : (
                deletedImages.map((file, idx) => (
                  <li key={idx}>{file}</li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
