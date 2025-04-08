export function exportCOCO(projectTitle) {
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
  }
  