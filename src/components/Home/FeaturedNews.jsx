// frontend-user/src/components/Home/FeaturedNews.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiEye } from 'react-icons/fi';
import { format } from 'date-fns';

const FeaturedNews = ({ news }) => {
  if (!news || news.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No news available</p>
      </div>
    );
  }

  const featuredNews = news[0];
  const otherNews = news.slice(1, 4);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const assetBaseUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '');
    return `${assetBaseUrl}${imagePath}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Featured News */}
      <div className="lg:col-span-2">
        <Link to={`/news/${featuredNews.id}`} className="card group block">
          <div className="relative h-96 overflow-hidden">
            {featuredNews.images && featuredNews.images[0] ? (
               <img
                 src={getImageUrl(featuredNews.images[0].image_url)}
                 alt={featuredNews.title}
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
               />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <span className="text-white font-bold">No Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
              <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                {featuredNews.title}
              </h3>
              <p className="text-white text-sm line-clamp-2">{featuredNews.content}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Other News */}
      <div className="space-y-6">
        {otherNews.map((item) => (
          <Link key={item.id} to={`/news/${item.id}`} className="flex gap-4 group">
            <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
              {item.images && item.images[0] ? (
                   <img
                     src={getImageUrl(item.images[0].image_url)}
                     alt={item.title}
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                   />
              ) : (
                <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 text-xs">No img</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                {item.title}
              </h4>
              <div className="flex items-center text-xs text-gray-500 mt-2 space-x-3">
                <span className="flex items-center">
                  <FiCalendar className="mr-1 w-3 h-3" />
                  {format(new Date(item.created_at), 'MMM dd, yyyy')}
                </span>
                <span className="flex items-center">
                  <FiEye className="mr-1 w-3 h-3" />
                  {item.view_count}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedNews;