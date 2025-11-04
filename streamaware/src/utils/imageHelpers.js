// Helper function to get correct image paths for both development and production
export const getImagePath = (imagePath) => {
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  
  // In development, use relative path
  if (import.meta.env.DEV) {
    return `/${cleanPath}`;
  }
  
  // In production (GitHub Pages), use full path
  return `/streamaware/${cleanPath}`;
};

// Helper for handling external URLs vs local images
export const getImageSrc = (imagePath) => {
  if (!imagePath) return getImagePath('images/placeholder.png');
  
  // If it's already a full URL (http/https), return as-is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it already has the correct path, return as-is
  if (import.meta.env.PROD && imagePath.startsWith('/streamaware/')) {
    return imagePath;
  }
  
  // Otherwise, process through getImagePath
  return getImagePath(imagePath);
};