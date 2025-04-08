import React, { useState, useEffect } from 'react';
import './RegionEditor.css';

const RegionEditorOverlay = ({ region, classes, onUpdate, onDelete, onClose }) => {
    const initialClass = region.region_attributes?.class || '';
    const initialDesc = region.region_attributes?.description || '';

    const [selectedClass, setSelectedClass] = useState(region.region_attributes?.class || '');
    const [description, setDescription] = useState(region.region_attributes?.description || '');


    useEffect(() => {
        // If only one class exists and none is selected, auto-select it
        if (classes.length === 1 && !selectedClass) {
            setSelectedClass(classes[0].name);
        }
    }, [classes, selectedClass]);

    const handleSave = () => {
        onUpdate({
            ...region,
            region_attributes: {
                class: selectedClass,
                description: description
            }
        });
        onClose();
    };

    return (
        <div className="region-editor-overlay">
            <div className="editor-header">
                <strong>Annotation Editor</strong>
                <button className="close-btn" onClick={onClose}>&times;</button>
            </div>

            <div className="editor-body">
                <label>Description</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter region description"
                />

                <label>Class</label>
                {classes.length <= 1 ? (
                    <div className="auto-class">{classes[0]?.name || 'No Class Available'}</div>
                ) : (
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    >
                        <option value="" disabled>Select class</option>
                        {classes.map((cls, i) => (
                            <option key={i} value={cls.name}>
                                {cls.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <div className="editor-actions">
                <button className="delete-btn" onClick={onDelete}>Delete</button>
                <button className="save-btn" onClick={handleSave}>Save (Enter)</button>
            </div>
        </div>

    );

};

export default RegionEditorOverlay;
