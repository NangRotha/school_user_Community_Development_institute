// frontend-user/src/pages/News.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiEye, FiImage } from 'react-icons/fi';
import { format } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';
import { getAllNews } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const News = () => {
  const { t, language } = useLanguage();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await getAllNews();
      setNews(response.data || []);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

   // Fixed getAssetUrl function with proper null checks
   const getAssetUrl = (path) => {
     if (!path || typeof path !== 'string') return null;
     let cleanPath = path;
     if (cleanPath.includes(' ')) {
       cleanPath = cleanPath.replace(/ /g, '%20');
     }
     if (cleanPath.startsWith('http')) return cleanPath;
     const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://school-backend-community-development.onrender.com/api';
     return `${apiBaseUrl.replace('/api', '')}${cleanPath}`;
   };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t('latestNews') || 'Latest News'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('stayUpdated') || 'Stay updated with the latest news and announcements from our school'}
          </p>
        </div>

        {news.length === 0 ? (
          <div className="text-center py-12">
            <FiImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">{t('noNews') || 'No news available at the moment.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => {
              const title = language === 'kh' && item.title_kh ? item.title_kh : item.title;
              const content = language === 'kh' && item.content_kh ? item.content_kh : item.content;
              const firstImage = item.images && item.images[0] ? getAssetUrl(item.images[0].image_url) : null;
              
              return (
                <Link 
                  key={item.id} 
                  to={`/news/${item.id}`} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all group"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    {firstImage ? (
                      <img 
                        src={firstImage}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          if (parent) {
                            const fallback = document.createElement('div');
                            fallback.className = 'w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center';
                            fallback.innerHTML = '<svg class="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                            parent.appendChild(fallback);
                            e.target.remove();
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                        <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {item.images && item.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        +{item.images.length - 1}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                      <span className="flex items-center">
                        <FiCalendar className="mr-1 w-4 h-4" />
                        {format(new Date(item.created_at), 'MMM dd, yyyy')}
                      </span>
                      <span className="flex items-center">
                        <FiEye className="mr-1 w-4 h-4" />
                        {item.view_count} {t('views') || 'views'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3">{content}</p>
                    <div className="mt-4 text-primary-600 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                      {t('readMore') || 'Read More'} →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;