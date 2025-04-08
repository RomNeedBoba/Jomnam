import React, { useRef, useEffect, useState } from 'react';

const Polygon = ({ polygon, isSelected, setSelectedId, updateRegion, setInteracting }) => {
    const [dragging, setDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(null);
    const [resizingIndex, setResizingIndex] = useState(null);
    const containerRef = useRef();

    const getCursorStyle = (index) => {
        return 'nwse-resize';
    };

    const handleMouseDown = (e) => {
        if (!isSelected) return;
        const svgRect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - svgRect.left;
        const y = e.clientY - svgRect.top;
        setInteracting(true);

        // If clicked near a point, start resizing
        const radius = 6;
        for (let i = 0; i < polygon.points.length; i++) {
            const point = polygon.points[i];
            if (Math.abs(point.x - x) < radius && Math.abs(point.y - y) < radius) {
                setResizingIndex(i);
                return;
            }
        }

        // Otherwise, drag whole polygon
        setDragging(true);
        setDragOffset({ x, y });
    };

    const handleMouseMove = (e) => {
        if (!isSelected || (!dragging && resizingIndex === null)) return;
        const svgRect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - svgRect.left;
        const y = e.clientY - svgRect.top;

        if (resizingIndex !== null) {
            const newPoints = [...polygon.points];
            newPoints[resizingIndex] = { x, y };
            updateRegion(polygon.id, prev => ({ ...prev, points: newPoints }));
        } else if (dragging && dragOffset) {
            const dx = x - dragOffset.x;
            const dy = y - dragOffset.y;
            const movedPoints = polygon.points.map(p => ({
                x: p.x + dx,
                y: p.y + dy,
            }));
            updateRegion(polygon.id, prev => ({ ...prev, points: movedPoints }));
            setDragOffset({ x, y });
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
        setResizingIndex(null);
        setInteracting(false);
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    });

    const pointsStr = polygon.points.map(p => `${p.x},${p.y}`).join(" ");

    return (
        <svg
            ref={containerRef}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%', zIndex: 10 }}
        >
            <polygon
                points={pointsStr}
                fill="rgba(0, 255, 0, 0.1)"
                stroke="green"
                strokeWidth={2}
                style={{ pointerEvents: 'auto', cursor: 'move' }}
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(polygon.id);
                }}
                onMouseDown={handleMouseDown}
            />

            {isSelected &&
                polygon.points.map((p, i) => (
                    <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r={6}
                        fill="white"
                        stroke="red"
                        strokeWidth="2"
                        style={{
                            cursor: getCursorStyle(i),
                            pointerEvents: 'auto',
                        }}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            setSelectedId(polygon.id);
                            setResizingIndex(i);
                            setInteracting(true);
                        }}
                    />
                ))}
        </svg>
    );
};

export default Polygon;
