// frontend-user/src/components/Common/NewsCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiEye } from 'react-icons/fi';
import { format } from 'date-fns';

const NewsCard = ({ news }) => {
  const firstImage = news.images && news.images.length > 0 ? news.images[0].image_url : null;

   const getImageUrl = (path) => {
     if (!path) return null;
     if (path.startsWith('http')) return path;
     const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://school-backend-community-development.onrender.com/api';
     const assetBaseUrl = apiBaseUrl.replace(/\/api$/, '');
     return `${assetBaseUrl}${path}`;
   };

  return (
    <Link to={`/news/${news.id}`} className="card group">
      <div className="relative h-48 overflow-hidden">
        {firstImage ? (
           <img 
             src={getImageUrl(firstImage)} 
             alt={news.title}
             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
           />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <span className="text-white font-bold">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
      </div>
      <div className="p-5">
        <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
          <span className="flex items-center">
            <FiCalendar className="mr-1 w-4 h-4" />
            {format(new Date(news.created_at), 'MMM dd, yyyy')}
          </span>
          <span className="flex items-center">
            <FiEye className="mr-1 w-4 h-4" />
            {news.view_count} views
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {news.title}
        </h3>
        <p className="text-gray-600 line-clamp-2">{news.content}</p>
        <div className="mt-4 text-primary-600 font-semibold group-hover:translate-x-2 transition-transform inline-block">
          Read More →
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;