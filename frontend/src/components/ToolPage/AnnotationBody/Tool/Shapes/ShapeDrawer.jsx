import React, { useState, useEffect, useRef } from 'react';
import Rect from './Rect';
import Polygon from './Polygon';
import RegionEditorOverlay from '../../Class/RegionEditor';

const ShapeDrawer = ({
    imageRef,
    activeTool,
    selectedImage,
    regions,
    setRegions,
    onAddRegion,
    zoom = 1,
    offset = { x: 0, y: 0 },
    classList = []
}) => {
    const containerRef = useRef();
    const imageName = selectedImage?.name;
    const regionList = regions[imageName] || [];

    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [polygonPoints, setPolygonPoints] = useState([]);
    const [draggingId, setDraggingId] = useState(null);
    const [resizing, setResizing] = useState(null);
    const [offsetDrag, setOffsetDrag] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);

    const polygonInteractingRef = useRef(false);

    useEffect(() => {
        const onUpdate = (e) => {
            const { id, newPoints } = e.detail;
            updateRegion(id, r => ({ ...r, points: newPoints }));
        };
        window.addEventListener('polygon-update', onUpdate);
        return () => window.removeEventListener('polygon-update', onUpdate);
    }, []);

    const getMousePos = (e) => {
        const rect = imageRef.current.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left - offset.x) / zoom,
            y: (e.clientY - rect.top - offset.y) / zoom,
        };
    };

    const updateRegion = (id, updateFn) => {
        setRegions(prev => {
            const updated = {
                ...prev,
                [imageName]: prev[imageName].map(r => r.id === id ? updateFn(r) : r)
            };
            const updatedRegion = updated[imageName].find(r => r.id === id);
            setSelectedRegion(updatedRegion);
            return updated;
        });
    };

    const deleteRegion = (id) => {
        setRegions(prev => ({
            ...prev,
            [imageName]: prev[imageName].filter(r => r.id !== id)
        }));
        setSelectedId(null);
        setSelectedRegion(null);
    };

    const getResizeDots = (r) => ({
        topleft: { x: r.x, y: r.y },
        topright: { x: r.x + r.width, y: r.y },
        bottomleft: { x: r.x, y: r.y + r.height },
        bottomright: { x: r.x + r.width, y: r.y + r.height }
    });

    const isInsideRegion = ({ x, y }) => {
        for (const r of regionList) {
            if (r.shape === 'rect') {
                if (x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height) return true;
            }
            if (r.shape === 'polygon') {
                const points = r.points;
                let inside = false;
                for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
                    const xi = points[i].x, yi = points[i].y;
                    const xj = points[j].x, yj = points[j].y;
                    const intersect = ((yi > y) !== (yj > y)) &&
                        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                    if (intersect) inside = !inside;
                }
                if (inside) return true;
            }
        }
        return false;
    };

    const handleMouseDown = (e) => {
        if (!imageRef.current || e.button !== 0) return;
        const { x, y } = getMousePos(e);

        if (activeTool === 'rect') {
            for (const r of regionList.filter(r => r.shape === 'rect')) {
                const dots = getResizeDots(r);
                for (let corner in dots) {
                    const dot = dots[corner];
                    if (Math.abs(dot.x - x) < 6 && Math.abs(dot.y - y) < 6) {
                        setResizing({ id: r.id, corner });
                        return;
                    }
                }
            }

            const hit = regionList.find(r => r.shape === 'rect' && x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height);
            if (hit) {
                setDraggingId(hit.id);
                setOffsetDrag({ x: x - hit.x, y: y - hit.y });
                setSelectedId(hit.id);
                setSelectedRegion(hit);
                return;
            }

            setStart({ x, y });
            setEnd(null);
            setSelectedId(null);
            setSelectedRegion(null);
        }

        if (activeTool === 'polygon' && !polygonInteractingRef.current && !isInsideRegion({ x, y })) {
            if (polygonPoints.length === 0) {
                setSelectedId(null);
                setSelectedRegion(null);
            }
            setPolygonPoints(prev => [...prev, { x, y }]);
        }
    };

    const handleMouseMove = (e) => {
        if (!imageRef.current) return;
        const { x, y } = getMousePos(e);

        if (activeTool === 'rect') {
            if (start) setEnd({ x, y });
            else if (resizing) {
                updateRegion(resizing.id, r => {
                    const updated = { ...r };
                    if (resizing.corner.includes('right')) updated.width = Math.max(5, x - updated.x);
                    if (resizing.corner.includes('bottom')) updated.height = Math.max(5, y - updated.y);
                    if (resizing.corner.includes('left')) {
                        const diff = updated.x - x;
                        updated.x = x;
                        updated.width += diff;
                    }
                    if (resizing.corner.includes('top')) {
                        const diff = updated.y - y;
                        updated.y = y;
                        updated.height += diff;
                    }
                    return updated;
                });
            } else if (draggingId !== null && offsetDrag) {
                updateRegion(draggingId, r => ({
                    ...r,
                    x: x - offsetDrag.x,
                    y: y - offsetDrag.y,
                }));
            }
        }
    };

    const handleMouseUp = () => {
        if (activeTool === 'rect' && start && end) {
            const x = Math.min(start.x, end.x);
            const y = Math.min(start.y, end.y);
            const width = Math.abs(start.x - end.x);
            const height = Math.abs(start.y - end.y);

            if (width >= 5 && height >= 5) {
                const id = Date.now();
                const newRegion = { id, shape: 'rect', x, y, width, height };
                setRegions(prev => ({
                    ...prev,
                    [imageName]: [...(prev[imageName] || []), newRegion],
                }));
                onAddRegion({
                    region_id: id,
                    shape_attributes: {
                        name: 'rect',
                        x: Math.round(x),
                        y: Math.round(y),
                        width: Math.round(width),
                        height: Math.round(height),
                    },
                    region_attributes: { class: '', description: '' },
                });
            }
        }

        setStart(null);
        setEnd(null);
        setDraggingId(null);
        setResizing(null);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            if (activeTool === 'polygon') {
                setPolygonPoints(prev => prev.slice(0, -1));
            } else {
                setStart(null);
                setEnd(null);
                setDraggingId(null);
                setResizing(null);
            }
        }

        if (e.key === 'Enter' && polygonPoints.length >= 3 && activeTool === 'polygon') {
            const id = Date.now();
            const newRegion = { id, shape: 'polygon', points: polygonPoints };
            setRegions(prev => ({
                ...prev,
                [imageName]: [...(prev[imageName] || []), newRegion],
            }));
            onAddRegion({
                region_id: id,
                shape_attributes: {
                    name: 'polygon',
                    all_points_x: polygonPoints.map(p => Math.round(p.x)),
                    all_points_y: polygonPoints.map(p => Math.round(p.y)),
                },
                region_attributes: { class: '', description: '' },
            });
            setPolygonPoints([]);
        }

        if (e.key === 'Delete' && selectedId !== null) {
            deleteRegion(selectedId);
        }
    };

    useEffect(() => {
        const node = containerRef.current;
        if (node) node.addEventListener('keydown', handleKeyDown);
        return () => node?.removeEventListener('keydown', handleKeyDown);
    }, [selectedId, polygonPoints]);

    const preview = start && end ? {
        x: Math.min(start.x, end.x),
        y: Math.min(start.y, end.y),
        width: Math.abs(start.x - end.x),
        height: Math.abs(start.y - end.y),
    } : null;

    return (
        <>
            <div
                ref={containerRef}
                tabIndex={0}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                {activeTool === 'rect' && preview && (
                    <div
                        style={{
                            position: 'absolute',
                            border: '2px dashed red',
                            left: preview.x,
                            top: preview.y,
                            width: preview.width,
                            height: preview.height,
                            pointerEvents: 'none',
                        }}
                    />
                )}

                {regionList.map(region => {
                    if (region.shape === 'rect') {
                        return (
                            <Rect
                                key={region.id}
                                rect={region}
                                isSelected={selectedId === region.id}
                                setSelectedId={setSelectedId}
                                setResizing={setResizing}
                                getResizeDots={getResizeDots}
                                zoom={zoom}
                                offset={offset}
                            />
                        );
                    }
                    if (region.shape === 'polygon') {
                        return (
                            <Polygon
                                key={region.id}
                                polygon={region}
                                isSelected={selectedId === region.id}
                                setSelectedId={setSelectedId}
                                updateRegion={updateRegion}
                                setInteracting={v => polygonInteractingRef.current = v}
                                zoom={zoom}
                            />
                        );
                    }
                    return null;
                })}

                {activeTool === 'polygon' && polygonPoints.length > 0 && (
                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                        <polyline
                            points={polygonPoints.map(p => `${p.x},${p.y}`).join(" ")}
                            fill="rgba(0, 255, 0, 0.1)"
                            stroke="green"
                            strokeWidth={2 / zoom}
                        />
                        {polygonPoints.map((p, i) => (
                            <circle
                                key={i}
                                cx={p.x}
                                cy={p.y}
                                r={4 / zoom}
                                fill="white"
                                stroke="green"
                                strokeWidth={2 / zoom}
                            />
                        ))}
                    </svg>
                )}
            </div>

            {selectedRegion && (
                <RegionEditorOverlay
                    region={selectedRegion}
                    classes={classList}
                    onUpdate={(updated) => updateRegion(selectedRegion.id, () => updated)}
                    onDelete={() => deleteRegion(selectedRegion.id)}
                    onClose={() => {
                        setSelectedId(null);
                        setSelectedRegion(null);
                    }}
                />
            )}

        </>
    );
};

export default ShapeDrawer;
