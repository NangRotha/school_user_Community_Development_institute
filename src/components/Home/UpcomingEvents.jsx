// frontend-user/src/components/Home/UpcomingEvents.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin } from 'react-icons/fi';
import { format } from 'date-fns';

const UpcomingEvents = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No upcoming events</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Link key={event.id} to={`/events/${event.id}`} className="card p-6 hover:shadow-xl transition-all group">
          <div className="flex items-start space-x-4">
            <div className="bg-primary-100 rounded-lg p-3 text-center min-w-[80px]">
              <div className="text-3xl font-bold text-primary-600">
                {event.start_date && format(new Date(event.start_date), 'dd')}
              </div>
              <div className="text-sm text-gray-600">
                {event.start_date && format(new Date(event.start_date), 'MMM')}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                {event.title}
              </h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{event.description}</p>
              <div className="flex items-center text-gray-500 text-xs">
                <FiMapPin className="mr-1 w-3 h-3" />
                {event.location}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default UpcomingEvents;