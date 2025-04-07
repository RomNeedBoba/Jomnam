// utils/annotationStorage.js

/**
 * Ensures a single image is present in annotationsPreview. Used for incremental updates.
 */
export function ensureImageInAnnotations(filename, size) {
  const raw = localStorage.getItem('annotationsPreview') || '{}';

  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    json = {};
  }

  json.files = json.files || {};

  const alreadyExists = Object.values(json.files).some(f => f.fname === filename);
  if (!alreadyExists) {
    const fileKey = `file_${Object.keys(json.files).length + 1}`;
    json.files[fileKey] = { fname: filename, size: size || 0 };
    localStorage.setItem('annotationsPreview', JSON.stringify(json, null, 2));
  }
}

/**
 * Removes an image and its metadata from annotationsPreview by filename.
 */
export function removeImageFromAnnotations(filename) {
  const raw = localStorage.getItem('annotationsPreview');
  if (!raw) return;

  try {
    const json = JSON.parse(raw);
    const files = json.files || {};
    const metadata = json.metadata || {};

    // Find and remove file entry
    const fileKey = Object.keys(files).find(key => files[key].fname === filename);
    if (!fileKey) return;

    delete files[fileKey];

    // Remove regions related to this file
    const newMetadata = {};
    for (const [metaKey, value] of Object.entries(metadata)) {
      if (value.image_id !== fileKey) {
        newMetadata[metaKey] = value;
      }
    }

    localStorage.setItem('annotationsPreview', JSON.stringify({
      ...json,
      files,
      metadata: newMetadata
    }, null, 2));

    console.log(`🗑️ Removed '${filename}' from annotationsPreview.`);
  } catch (err) {
    console.error("❌ Failed to update annotationsPreview:", err);
  }
}

/**
 * Rebuilds the entire annotationsPreview structure from the current list of images.
 * Maintains file order and keeps metadata that matches.
 */
export function syncImagesToAnnotationsPreview(images) {
  const raw = localStorage.getItem('annotationsPreview');
  let annotations = raw ? JSON.parse(raw) : { files: {}, metadata: {} };

  const newFiles = {};
  const newMetadata = {};

  images.forEach((img, index) => {
    const fileKey = `file_${index + 1}`;
    newFiles[fileKey] = {
      fname: img.name,
      size: img.size || 0,
    };

    // Only keep metadata that belongs to current image
    Object.entries(annotations.metadata).forEach(([metaKey, meta]) => {
      if (meta.image_id === fileKey) {
        newMetadata[metaKey] = meta;
      }
    });
  });

  localStorage.setItem('annotationsPreview', JSON.stringify({
    files: newFiles,
    metadata: newMetadata
  }, null, 2));

  console.log("✅ Synced annotationsPreview with current images.");
}
