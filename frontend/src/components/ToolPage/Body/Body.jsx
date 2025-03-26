import React, { useEffect } from 'react';
import { Button, Input, Select } from 'antd';
import './Body.css'; 

const TextAnnotationTool = () => {

  useEffect(() => {
    // Initialize or update the UI components when the component mounts
    _via_init();
    window.addEventListener('resize', _via_update_ui_components);
    
    return () => {
      // Cleanup on unmount
      window.removeEventListener('resize', _via_update_ui_components);
    };
  }, []);

  return (
    <div>
      {/* Used by invoke_with_user_inputs() to gather user inputs */}
      <div id="user_input_panel"></div>

      {/* To show status messages */}
      <div id="message_panel">
        <div id="message_panel_content" className="content"></div>
      </div>

      {/* Spreadsheet-like editor for annotations */}
      <div id="annotation_editor_panel">
        <div className="button_panel">
          <span
            className="text_button"
            onClick={() => edit_region_metadata_in_annotation_editor()}
            id="button_edit_region_metadata"
            title="Manual annotations of regions"
          >
            Region Annotations
          </span>
          <span
            className="text_button"
            onClick={() => edit_file_metadata_in_annotation_editor()}
            id="button_edit_file_metadata"
            title="Manual annotations of a file"
          >
            File Annotations
          </span>
        </div>
      </div>

      {/* Top Panel */}
      <div className="top_panel" id="ui_top_panel">
        <input type="file" id="invisible_file_input" name="files[]" style={{ display: 'none' }} />
      </div>

      {/* Middle Panel */}
      <div className="middle_panel">
        <div id="leftsidebar_collapse_panel"></div>
        <div id="leftsidebar">
          <div
            className=""
            id="project_panel_title"
            style={{
              backgroundColor: '#1E3E62',
              color: 'white',
              padding: '10px',
              fontWeight: 'bold',
              fontSize: '16px',
              textAlign: 'start',
            }}
          >
            Project
          </div>

          <div className="leftsidebar_accordion_panel show" id="img_fn_list_panel">
            <div id="project_info_panel">
              <div className="row">
                <span className="col">
                  <label></label>
                </span>
                <span className="col" id="project_name"></span>
              </div>
            </div>

            <div id="project_tools_panel">
              <div className="button_panel" style={{ margin: '0.1rem 0' }}>
                <Select
                  style={{ width: '48%' }}
                  id="filelist_preset_filters_list"
                  onChange={img_fn_list_onpresetfilter_select}
                  title="Filter file list using predefined filters"
                >
                  <Select.Option value="all">All files</Select.Option>
                  <Select.Option value="files_without_region">Unannotated Images</Select.Option>
                </Select>
                <Input
                  style={{ width: '50%' }}
                  placeholder="Search Files"
                  onChange={img_fn_list_onregex}
                  id="img_fn_list_regex"
                  title="Filter using regular expression"
                />
              </div>
            </div>
          </div>

          {/* Class */}
          <div>
            <h2
              style={{
                backgroundColor: '#1E3E62',
                padding: '10px',
                margin: '0',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
              className="class-title"
            >
              Classes
            </h2>
          </div>

          {/* Add Class Modal */}
          <div id="addModalUnique" className="modal-overlay-unique" style={{ zIndex: 1000, display: 'none' }}>
            <div className="modal-content-unique">
              <span className="modal-close-unique" onClick={() => closeModalUnique('addModalUnique')}>
                &times;
              </span>
              <h3>Create New Class</h3>
              <Input id="newClassInputUnique" type="text" className="ant-input" placeholder="Enter class name" />
              <div className="modal-footer-unique">
                <Button
                  id="button_add_new_attribute user_input_attribute_id"
                  className="ant-btn ant-btn-primary button"
                  title="Add new attribute"
                  onClick={() => {
                    addClassUnique();
                    add_new_attribute_from_user_input();
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>

          {/* Main Display Area */}
          <div id="display_area">
            <div id="image_panel" className="display_area_content display_none">
              <canvas id="region_canvas" width="1" height="1" tabIndex="1">
                Sorry, your browser does not support HTML5 Canvas functionality.
              </canvas>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <button className="icon-buttonnn">
          <img src="hand.svg" alt="Hand Icon" width="24" height="24" />
          <span className="tooltip">Hand (H)</span>
        </button>
        <button className="icon-buttonnn" onClick={() => select_region_shape('rect')}>
          <img src="bounding.svg" alt="Bounding Box Icon" width="24" height="24" />
          <span className="tooltip">Bounding Box (B)</span>
        </button>
        <button className="icon-buttonnn" onClick={() => select_region_shape('polygon')}>
          <img src="polygon.svg" alt="Polygon Icon" width="24" height="24" />
          <span className="tooltip">Polygon (P)</span>
        </button>
      </div>
    </div>
  );
};

export default TextAnnotationTool;
