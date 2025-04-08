export function previewAnnotation(projectTitle) {
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
        <h2>📄 Annotation Preview - ${projectTitle}</h2>
        <table>
          <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </body></html>
    `);
    previewWindow.document.close();
  }
  