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
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://school-backend-community-development.onrender.com/api';
  return `${apiBaseUrl.replace('/api', '')}/${cleanPath}`;
};

export default getImageUrl;
