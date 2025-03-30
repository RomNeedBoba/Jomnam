import React, { useState, useEffect } from 'react';
import './ToolHeader.css';

const Header = () => {
  const [projectTitle, setProjectTitle] = useState('Untitled Project');

  // Load saved title from local storage if it exists
  useEffect(() => {
    const savedTitle = localStorage.getItem("projectTitle");
    if (savedTitle) {
      setProjectTitle(savedTitle);
    }

    // Load external script
    const script = document.createElement("script");
    script.src = "/script.js"; // Load script from public folder
    script.async = true;
    script.onload = () => console.log("Script loaded!");
    document.body.appendChild(script);

    return () => {
      console.log("Header unmounted, but script stays.");
    };
  }, []);

  const handleTitleClick = () => {
    const newTitle = prompt("Enter new project title:", projectTitle);
    if (newTitle !== null && newTitle.trim() !== "") {
      setProjectTitle(newTitle);
      
      // Make sure `leftSidebar` exists before using it
      const leftSidebar = document.getElementById('leftSidebar');
      if (leftSidebar) {
        leftSidebar.style.display = 'none';
      } else {
        console.warn("leftSidebar not found!");
      }
    }
  };

  // Ensure leftSidebarToggle exists before using it
  const handleLeftSidebarToggle = () => {
    if (typeof leftSidebarToggle === 'function') {
      leftSidebarToggle();
    } else {
      console.warn("leftSidebarToggle function not found!");
    }
  };

  return (
    <header className="header">
      {/* Logo */}
      <div className="logo">
        <img src="/src/assets/golo.png" alt="Logo" className="logo-img" />
      </div>

      <div className="title-menu-container">
        <div className="title" id="projectTitle" onClick={handleTitleClick}>
          {projectTitle}
        </div>

        <nav className="menu">
          <div className="menu-item">File
            <ul className="dropdown">
              <li>
                Open From
                <span className="chevron">→</span>
                <ul className="nested-dropdown">
                  <li>Google Drive...</li>
                  <li>One Drive...</li>
                  <li>Local Drive...</li>
                </ul>
              </li>
              <hr />
              <li onClick={() => alert('Save clicked')} title="Save this VIA project (as a JSON file)">Save</li>
              <li>Save as...</li>
            </ul>
          </div>

          <div className="menu-item">Annotation
            <ul className="dropdown">
              <li>Export
                <span className="chevron">→</span>
                <ul className="nested-dropdown">
                  <li onClick={() => alert('Export as json clicked')} title="Export annotations to a JSON file">Export as json</li>
                  <li onClick={() => alert('Export as CSV clicked')} title="Export annotations to a CSV file">Export as CSV</li>
                  <li onClick={() => alert('Export as COCO clicked')} title="Export annotations to COCO format">Export as COCO</li>
                </ul>
              </li>
              <li>Import
                <span className="chevron">→</span>
                <ul className="nested-dropdown">
                  <li onClick={() => alert('Import from json clicked')} title="Import annotations from a JSON file">Import from json</li>
                  <li onClick={() => alert('Import from CSV clicked')} title="Import annotations from a CSV file">Import from CSV</li>
                  <li onClick={() => alert('Import from COCO clicked')} title="Import annotations from COCO format">Import as COCO</li>
                </ul>
              </li>
              <hr />
              <li onClick={() => alert('Preview Annotation clicked')} title="Show a preview of annotations">Preview Annotation</li>
            </ul>
          </div>

          <div className="menu-item">View
            <ul className="dropdown">
              <li onClick={() => alert('Toggle Image Grid View clicked')} title="Toggle between single image view and image grid view">Toggle Image Grid View</li>
              <li onClick={handleLeftSidebarToggle} title="Show or hide the sidebar shown in left hand side">Toggle Left Sidebar</li>
              <li onClick={() => alert('Toggle Image Filename List clicked')} title="Show or hide a panel to update annotations">Toggle Image Filename List</li>
              <li className="submenu_divider"></li>
              <li onClick={() => alert('Toggle Attributes Editor clicked')} title="Show or hide a panel to update file and region attributes">Toggle Attributes Editor</li>
              <li onClick={() => alert('Toggle Annotation Editor clicked')} title="Show or hide a panel to update annotations">Toggle Annotation Editor</li>
              <li className="submenu_divider"></li>
              <li onClick={() => alert('Show/Hide Region Boundaries clicked')} title="Show or hide the region boundaries">Show/Hide Region Boundaries</li>
              <li onClick={() => alert('Show/Hide Region Labels clicked')} title="Show or hide the region id labels">Show/Hide Region Labels</li>
              <li onClick={() => alert('Show/Hide Region Info clicked')} title="Show or hide the image coordinates">Show/Hide Region Info</li>
            </ul>
          </div>

          <div className="menu-item">Help
            <ul className="dropdown">
              <li>Documentation</li>
              <li>About</li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
