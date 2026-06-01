// frontend-user/src/pages/Courses.jsx
import React, { useState, useEffect } from 'react';
import { FiClock, FiDollarSign, FiBookOpen } from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';
import { getCourses } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Courses = () => {
  const { t } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('courses')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive range of courses designed for student success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6">
                <FiBookOpen className="w-12 h-12 text-white mb-3" />
                <h3 className="text-xl font-bold text-white">{course.name}</h3>
                {course.name_kh && (
                  <p className="text-primary-100 text-sm">{course.name_kh}</p>
                )}
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <FiClock className="mr-3 text-primary-500" />
                    <span>Duration: {course.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiDollarSign className="mr-3 text-primary-500" />
                    <span>Fee: ${course.fee.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {course.description || 'No description available'}
                </p>
                {course.description_kh && (
                  <p className="text-gray-500 text-xs khmer-text mt-2 line-clamp-2">
                    {course.description_kh}
                  </p>
                )}
                <button className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No courses available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;