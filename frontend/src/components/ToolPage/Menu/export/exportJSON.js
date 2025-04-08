export function exportJSON(projectTitle) {
    const data = localStorage.getItem('annotationsPreview');
    if (!data) return alert("No annotation data found.");
  
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${projectTitle || 'annotations'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
  