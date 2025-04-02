const DELETED_KEY = "deletedImages"; // Unified Key

export const saveDeletedImage = (filename) => {
  const existing = JSON.parse(localStorage.getItem(DELETED_KEY) || "[]");
  if (!existing.includes(filename)) {
    existing.push(filename);
    localStorage.setItem(DELETED_KEY, JSON.stringify(existing));
  }
};

export const getDeletedImages = () => {
  return JSON.parse(localStorage.getItem(DELETED_KEY) || "[]");
};

export const clearDeletedImages = () => {
  localStorage.removeItem(DELETED_KEY);
};
