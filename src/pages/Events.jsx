// frontend-user/src/pages/Events.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiClock, FiImage } from 'react-icons/fi';
import { format } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';
import { getEvents } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Events = () => {
  const { t, language } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      console.log('Fetching events...');
      const response = await getEvents(false, 10);
      console.log('Events response:', response.data);
      setEvents(response.data || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Improved getImageUrl function with better error handling
  const getImageUrl = (imagePath) => {
    console.log('Processing image path:', imagePath);
    
    if (!imagePath || typeof imagePath !== 'string') {
      console.log('No valid image path');
      return null;
    }
    
    // If empty string or null
    if (imagePath.trim() === '') {
      console.log('Empty image path');
      return null;
    }
    
    let cleanPath = imagePath;
    
    // Replace spaces with %20
    if (cleanPath.includes(' ')) {
      cleanPath = cleanPath.replace(/ /g, '%20');
    }
    
    // Remove duplicate slashes
    cleanPath = cleanPath.replace(/\/+/g, '/');
    
    // Ensure path starts with /
    if (!cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath;
    }
    
    // If already has http, return as is
    if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
      return cleanPath;
    }
    
    const fullUrl = `http://localhost:8000${cleanPath}`;
    console.log('Generated image URL:', fullUrl);
    return fullUrl;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t('events') || 'Events'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('upcomingEventsDesc') || 'Discover upcoming events and activities at our school'}
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <FiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">{t('noEvents') || 'No upcoming events at the moment.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {events.map((event) => {
              const title = language === 'kh' && event.title_kh ? event.title_kh : event.title;
              const description = language === 'kh' && event.description_kh ? event.description_kh : event.description;
              const location = language === 'kh' && event.location_kh ? event.location_kh : event.location;
              const imageUrl = getImageUrl(event.image_url);
              
              console.log(`Event ${event.id} - Image URL:`, imageUrl);
              
              return (
                <Link 
                  key={event.id} 
                  to={`/events/${event.id}`} 
                  className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 block"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden bg-gray-200">
                      {imageUrl ? (
                        <img 
                          src={imageUrl}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            console.error('Image failed to load:', imageUrl);
                            e.target.style.display = 'none';
                            const parent = e.target.parentElement;
                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.className = 'w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center';
                              fallback.innerHTML = '<svg class="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                              parent.appendChild(fallback);
                              e.target.remove();
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                          <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Content Section */}
                    <div className="md:w-2/3 p-6">
                      <div className="flex flex-wrap items-center gap-4 mb-3">
                        <div className="flex items-center text-primary-600">
                          <FiCalendar className="mr-2" />
                          <span className="font-medium">
                            {event.start_date && format(new Date(event.start_date), 'MMMM dd, yyyy')}
                            {event.end_date && event.end_date !== event.start_date && (
                              <> - {format(new Date(event.end_date), 'MMMM dd, yyyy')}</>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <FiClock className="mr-2" />
                          <span>
                            {event.start_date && format(new Date(event.start_date), 'h:mm a')}
                            {event.end_date && event.end_date !== event.start_date && (
                              <> - {format(new Date(event.end_date), 'h:mm a')}</>
                            )}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                        {title}
                      </h3>
                      
                      <div className="flex items-center text-gray-500 mb-3">
                        <FiMapPin className="mr-2 flex-shrink-0" />
                        <span>{location || 'Location TBA'}</span>
                      </div>
                      
                      <p className="text-gray-600 line-clamp-2 mb-4">
                        {description || 'No description available'}
                      </p>
                      
                      <div className="flex items-center text-primary-600 font-semibold group-hover:translate-x-2 transition-transform">
                        {t('viewDetails') || 'View Details'} →
                      </div>
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

export default Events;