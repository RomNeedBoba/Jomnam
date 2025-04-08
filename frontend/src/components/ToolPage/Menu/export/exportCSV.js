export function exportCSV(projectTitle) {
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
  
    const csvContent = rows.map(r => r.map(val => `"${val}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${projectTitle || 'annotations'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
  