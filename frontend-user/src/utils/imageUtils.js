// frontend-user/src/utils/imageUtils.js
export const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return null;
  
  // Clean the path
  let cleanPath = imagePath;
  
  // Replace spaces with underscore or %20
  cleanPath = cleanPath.replace(/ /g, '_');
  
  // Remove duplicate slashes
  cleanPath = cleanPath.replace(/\/+/g, '/');
  
  // Ensure no leading slash
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }
  
  // Build URL
  return `http://localhost:8000/${cleanPath}`;
};

export default getImageUrl;
