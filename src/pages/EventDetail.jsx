// frontend-user/src/pages/EventDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiClock, FiArrowLeft } from 'react-icons/fi';
import { format } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';
import { getEventById } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const EventDetail = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await getEventById(id);
      setEvent(response.data);
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      setLoading(false);
    }
   };

   const getImageUrl = (imagePath) => {
     if (!imagePath) return null;
     if (imagePath.startsWith('http')) return imagePath;
     const assetBaseUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '');
     return `${assetBaseUrl}${imagePath}`;
   };

   if (loading) return <LoadingSpinner />;
  if (!event) return <div className="pt-32 text-center">Event not found</div>;

  const title = language === 'kh' && event.title_kh ? event.title_kh : event.title;
  const description = language === 'kh' && event.description_kh ? event.description_kh : event.description;
  const location = language === 'kh' && event.location_kh ? event.location_kh : event.location;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container-custom max-w-4xl">
        <Link to="/events" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <FiArrowLeft className="mr-2" /> Back to Events
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
           {event.image_url && (
             <img 
               src={getImageUrl(event.image_url)}
               alt={event.title}
               className="w-full h-64 md:h-96 object-cover"
             />
           )}

          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h1>
            
            <div className="space-y-3 mb-6 pb-4 border-b">
              <div className="flex items-center text-gray-600">
                <FiCalendar className="mr-3 text-primary-500" />
                <span>
                  {format(new Date(event.start_date), 'EEEE, MMMM dd, yyyy')}
                  {event.end_date && event.end_date !== event.start_date && (
                    <> - {format(new Date(event.end_date), 'EEEE, MMMM dd, yyyy')}</>
                  )}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiClock className="mr-3 text-primary-500" />
                <span>
                  {format(new Date(event.start_date), 'h:mm a')}
                  {event.end_date && (
                    <> - {format(new Date(event.end_date), 'h:mm a')}</>
                  )}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiMapPin className="mr-3 text-primary-500" />
                <span>{location || 'Location to be announced'}</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {description || 'No description available'}
              </p>
            </div>

            <div className="mt-8 p-4 bg-primary-50 rounded-lg">
              <p className="text-primary-700 text-center">
                For more information, please contact our administration office.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;