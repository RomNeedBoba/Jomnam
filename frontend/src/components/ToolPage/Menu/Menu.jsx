import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import './ToolHeader.css';
import { getDeletedImages } from '../../../utils/deletedImages';

const Header = forwardRef((props, ref) => {
  const [projectTitle, setProjectTitle] = useState('Untitled Project');
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [deletedImages, setDeletedImages] = useState([]);

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

  const handleTitleClick = () => {
    const newTitle = prompt("Enter new project title:", projectTitle);
    if (newTitle && newTitle.trim()) {
      setProjectTitle(newTitle);
      localStorage.setItem("projectTitle", newTitle);
    }
  };

  const openDeletedModal = () => {
    const files = getDeletedImages();
    setDeletedImages(files);
    setShowDeletedModal(true);
  };

  const handlePreviewAnnotation = () => {
    // Retrieve annotation data from localStorage
    const annotationData = localStorage.getItem('annotationsPreview');
    const parsed = annotationData ? JSON.parse(annotationData) : null;

    if (!parsed) {
      alert('No annotation data found.');
      return;
    }

    // Convert annotation data to CSV-like format
    const headers = ["filename", "file_size", "file_attributes", "region_count", "region_id", "region_shape_attributes", "region_attributes"];
    const rows = [];

    Object.keys(parsed).forEach((imageName) => {
      const image = parsed[imageName];
      const file_size = image.size;  // Assuming 'size' is part of the image metadata
      const file_attributes = "{}";  // Assuming an empty object for file attributes
      const region_count = image.regions.length;
      
      image.regions.forEach((region, idx) => {
        const region_id = region.id;
        const region_shape_attributes = JSON.stringify(region.shape_attributes);
        const region_attributes = JSON.stringify(region.region_attributes);
        
        rows.push([
          imageName,
          file_size,
          file_attributes,
          region_count,
          region_id,
          region_shape_attributes,
          region_attributes
        ]);
      });
    });

    // Open a new window with the CSV content
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`
      <html>
        <head>
          <title>Annotation Preview</title>
          <style>
            body {
              font-family: monospace;
              background-color: #1e1e1e;
              color: #dcdcdc;
              padding: 20px;
              white-space: pre-wrap;
              overflow-x: auto;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 8px;
              border: 1px solid #444;
              text-align: left;
            }
          </style>
        </head>
        <body>
          <h2>📄 Annotation Preview</h2>
          <table>
            <thead>
              <tr>
                ${headers.map((header) => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${rows.map((row) => {
                return `
                  <tr>
                    ${row.map((cell) => `<td>${cell}</td>`).join('')}
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    previewWindow.document.close();
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
        "Preview Annotation"  // Add the Preview Annotation item
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
                        <li key={idx} onClick={item === "Preview Annotation" ? handlePreviewAnnotation : openDeletedModal}>
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
});

export default Header;
