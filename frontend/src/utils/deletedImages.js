// utils/deletedImages.js
const DELETED_KEY = 'deletedImages';

export function getDeletedImages() {
  try {
    const raw = localStorage.getItem(DELETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('❌ Failed to get deleted images:', err);
    return [];
  }
}

export function addDeletedImage(filename) {
  try {
    const current = getDeletedImages();
    const updated = [...new Set([...current, filename])];
    localStorage.setItem(DELETED_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('❌ Failed to save deleted image:', err);
  }
}

export function clearDeletedImages() {
  localStorage.removeItem(DELETED_KEY);
}
