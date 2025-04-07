import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import './ToolHeader.css';
import { getDeletedImages } from '../../../utils/deletedImages';

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

  const handleExportJSON = () => {
    const data = localStorage.getItem('annotationsPreview');
    if (!data) return alert("No annotation data found.");
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${projectTitle || 'annotations'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const raw = localStorage.getItem('annotationsPreview');
    if (!raw) return alert("No annotation data found.");

    let json;
    try {
      json = JSON.parse(raw);
    } catch {
      return alert("Invalid JSON format.");
    }

    const headers = ["filename", "file_size", "file_attributes", "region_count", "region_id", "region_shape_attributes", "region_attributes"];
    const rows = [headers];

    const fileMap = json.files || {};
    const metadataMap = json.metadata || {};

    Object.entries(fileMap).forEach(([fileKey, file]) => {
      const filename = file.fname;
      const file_size = file.size || 0;
      const file_attributes = "{}";
      const regions = Object.entries(metadataMap)
        .filter(([_, meta]) => meta.image_id === fileKey)
        .map(([_, meta]) => meta);

      if (regions.length === 0) {
        rows.push([filename, file_size, file_attributes, 0, "", "", ""]);
      } else {
        regions.forEach(region => {
          rows.push([
            filename,
            file_size,
            file_attributes,
            regions.length,
            region.region_id,
            JSON.stringify(region.shape_attributes),
            JSON.stringify(region.region_attributes)
          ]);
        });
      }
    });

    const csvContent = rows.map(r => r.map(val => `"${val}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${projectTitle || 'annotations'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCOCO = () => {
    const raw = localStorage.getItem('annotationsPreview');
    if (!raw) return alert("No annotation data found.");

    let json;
    try {
      json = JSON.parse(raw);
    } catch {
      return alert("Invalid JSON format.");
    }

    const coco = { images: [], annotations: [], categories: [] };
    const fileMap = json.files || {};
    const metadataMap = json.metadata || {};
    let annotationId = 1;

    Object.entries(fileMap).forEach(([fileKey, file], index) => {
      coco.images.push({ id: index + 1, file_name: file.fname, width: 0, height: 0 });

      const regions = Object.entries(metadataMap)
        .filter(([_, meta]) => meta.image_id === fileKey)
        .map(([_, meta]) => meta);

      regions.forEach(region => {
        const shape = region.shape_attributes;
        if (shape.name === 'rect') {
          coco.annotations.push({
            id: annotationId++,
            image_id: index + 1,
            bbox: [shape.x, shape.y, shape.width, shape.height],
            area: shape.width * shape.height,
            category_id: 1,
            iscrowd: 0,
          });
        }
      });
    });

    coco.categories.push({ id: 1, name: "object" });

    const blob = new Blob([JSON.stringify(coco, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${projectTitle || 'annotations'}.coco.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePreviewAnnotation = () => {
    const raw = localStorage.getItem('annotationsPreview');
    if (!raw) return alert("No annotation data found.");
  
    let json;
    try {
      json = JSON.parse(raw);
    } catch {
      return alert("Invalid JSON format.");
    }
  
    const headers = ["filename", "file_size", "file_attributes", "region_count", "region_id", "region_shape_attributes", "region_attributes"];
    const rows = [];
  
    const fileMap = json.files || {};
    const metadataMap = json.metadata || {};
  
    // Sort file entries by upload order based on the key (file_1, file_2, etc.)
    const sortedFileKeys = Object.keys(fileMap).sort((a, b) => {
      const aNum = parseInt(a.replace(/\D/g, ''), 10);
      const bNum = parseInt(b.replace(/\D/g, ''), 10);
      return aNum - bNum;
    });
  
    sortedFileKeys.forEach((fileKey) => {
      const file = fileMap[fileKey];
      const filename = file.fname;
      const file_size = file.size || 0;
  
      const regions = Object.entries(metadataMap)
        .filter(([_, meta]) => meta.image_id === fileKey)
        .map(([_, meta]) => meta);
  
      if (regions.length === 0) {
        rows.push([filename, file_size, "{}", 0, "", "", ""]);
      } else {
        regions.forEach(region => {
          rows.push([
            filename,
            file_size,
            "{}",
            regions.length,
            region.region_id,
            JSON.stringify(region.shape_attributes),
            JSON.stringify(region.region_attributes)
          ]);
        });
      }
    });
  
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`
      <html><head><title>Annotation Preview</title>
      <style>
        body { font-family: monospace; background: #1e1e1e; color: #dcdcdc; padding: 20px; white-space: pre-wrap; overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; border: 1px solid #444; text-align: left; }
      </style>
      </head><body>
        <h2>📄 Annotation Preview</h2>
        <table>
          <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </body></html>
    `);
    previewWindow.document.close();
  };
  

  const handleMenuClick = (item) => {
    switch (item) {
      case "Preview Annotation": return handlePreviewAnnotation();
      case "Export as CSV": return handleExportCSV();
      case "Export as JSON": return handleExportJSON();
      case "Export as COCO": return handleExportCOCO();
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
