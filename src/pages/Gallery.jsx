// frontend-user/src/pages/Gallery.jsx
import React, { useState, useEffect } from 'react';
import { FiImage, FiX, FiGrid, FiList } from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';
import { getGallery } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Gallery = () => {
  const { t } = useLanguage();
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState(['all']);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await getGallery();
      const data = response.data || [];
      setGallery(data);
      
      // Extract unique categories
      const uniqueCategories = ['all', ...new Set(data.map(item => item.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fixed getImageUrl function with timestamp to bypass cache
  const getImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') return null;
    
    // Add timestamp to bypass cache
    const timestamp = new Date().getTime();
    const separator = imagePath.includes('?') ? '&' : '?';
    
    let cleanPath = imagePath;
    
    // Replace spaces with %20
    if (cleanPath.includes(' ')) {
      cleanPath = cleanPath.replace(/ /g, '%20');
    }
    
    // Remove duplicate slashes
    cleanPath = cleanPath.replace(/\/+/g, '/');
    
    // Ensure path starts with / for local images
    if (!cleanPath.startsWith('/') && !cleanPath.startsWith('http')) {
      cleanPath = '/' + cleanPath;
    }
    
    // If it's an external URL
    if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
      return `${cleanPath}${separator}t=${timestamp}`;
    }
    
    // Local URL
    return `http://localhost:8000${cleanPath}${separator}t=${timestamp}`;
  };

  const filteredGallery = activeCategory === 'all' 
    ? gallery 
    : gallery.filter(item => item.category === activeCategory);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t('gallery') || 'Gallery'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore moments captured at our school
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-end mb-6">
          <div className="bg-white rounded-lg shadow-sm p-1 flex space-x-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <FiList className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gallery Content */}
        {filteredGallery.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <FiImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No images available in this category.</p>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredGallery.map((item, index) => {
              const imageUrl = getImageUrl(item.image_url);
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(imageUrl)}
                  className="group cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative overflow-hidden rounded-xl shadow-md aspect-square bg-gray-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          console.error('Image failed to load:', imageUrl);
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          if (parent) {
                            const fallback = document.createElement('div');
                            fallback.className = 'w-full h-full flex flex-col items-center justify-center bg-gray-200';
                            fallback.innerHTML = `
                              <svg class="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              <span class="text-gray-500 text-sm">No Image</span>
                            `;
                            parent.appendChild(fallback);
                            e.target.remove();
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
                        <FiImage className="w-12 h-12 text-gray-400 mb-2" />
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                        View
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // List View
          <div className="space-y-4">
            {filteredGallery.map((item, index) => {
              const imageUrl = getImageUrl(item.image_url);
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(imageUrl)}
                  className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-48 h-32 bg-gray-100 overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <FiImage className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-4">
                      <h3 className="font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-400">{item.category}</span>
                        <span className="text-primary-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <FiX className="w-8 h-8" />
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full">
            <img
              src={selectedImage}
              alt="Full size"
              className="w-full h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            {/* Navigation buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = filteredGallery.findIndex(item => getImageUrl(item.image_url) === selectedImage);
                const prevIndex = currentIndex - 1;
                if (prevIndex >= 0) {
                  setSelectedImage(getImageUrl(filteredGallery[prevIndex].image_url));
                }
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = filteredGallery.findIndex(item => getImageUrl(item.image_url) === selectedImage);
                const nextIndex = currentIndex + 1;
                if (nextIndex < filteredGallery.length) {
                  setSelectedImage(getImageUrl(filteredGallery[nextIndex].image_url));
                }
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
            {filteredGallery.findIndex(item => getImageUrl(item.image_url) === selectedImage) + 1} / {filteredGallery.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;