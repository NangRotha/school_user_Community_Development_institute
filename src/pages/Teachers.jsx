// frontend-user/src/pages/Teachers.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiUser, FiMapPin, FiBookOpen, FiAward } from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';
import { getTeachers } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Teachers = () => {
  const { t, language } = useLanguage();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await getTeachers();
      console.log('Teachers response:', response.data);
      setTeachers(response.data || []);
      console.log('Teachers state set to:', teachers); // Note: this will be the old state due to async
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
      // Set teachers to empty array on error to avoid showing old data
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

   // getImageUrl function - returns external URLs as is, adds timestamp to local URLs to bypass cache
   const getImageUrl = (imagePath) => {
     if (!imagePath || typeof imagePath !== 'string') return null;
 
     // If it's an external URL, return as is
     if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
       return imagePath;
     }
 
     // Add timestamp to bypass cache for local images
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
 
     // Local URL
     const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://school-backend-community-development.onrender.com/api';
     return `${apiBaseUrl.replace('/api', '')}${cleanPath}${separator}t=${timestamp}`;
   };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t('teachers') || 'Our Teachers'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet our dedicated and experienced teaching staff who are committed to your success
          </p>
        </div>

        {teachers.length === 0 ? (
          <div className="text-center py-12">
            <FiUser className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No teacher information available at the moment.</p>
          </div>
        ) : (
          <>
            {/* Teachers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {teachers.map((teacher) => {
                const name = language === 'kh' && teacher.name_kh ? teacher.name_kh : teacher.name;
                const position = language === 'kh' && teacher.position_kh ? teacher.position_kh : teacher.position;
                const imageUrl = getImageUrl(teacher.image);
                
                return (
                  <div 
                    key={teacher.id} 
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                    onClick={() => setSelectedTeacher(teacher)}
                  >
                    {/* Image Section */}
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={teacher.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            console.error('Image failed to load:', imageUrl);
                            e.target.style.display = 'none';
                            const parent = e.target.parentElement;
                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.className = 'w-full h-full flex flex-col items-center justify-center';
                              fallback.innerHTML = `
                                <svg class="w-20 h-20 text-white/50 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                <span class="text-white/70 text-sm">No Image</span>
                              `;
                              parent.appendChild(fallback);
                              e.target.remove();
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <FiUser className="w-20 h-20 text-white/50 mb-3" />
                          <span className="text-white/70 text-sm">No Image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-primary-600 transition-colors">
                        {name}
                      </h3>
                      <p className="text-primary-600 font-medium mb-3">{position}</p>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {teacher.bio || 'Dedicated teacher committed to student success and excellence in education.'}
                      </p>
                      <div className="flex justify-center space-x-4 pt-3 border-t border-gray-100">
                        <a 
                          href={`mailto:${teacher.email}`} 
                          className="text-gray-400 hover:text-primary-600 transition-all duration-300 hover:scale-110"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FiMail className="w-5 h-5" />
                        </a>
                        {teacher.phone && (
                          <a 
                            href={`tel:${teacher.phone}`} 
                            className="text-gray-400 hover:text-primary-600 transition-all duration-300 hover:scale-110"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FiPhone className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Statistics Section */}
            <div className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-white">{teachers.length}+</div>
                  <p className="text-primary-100 mt-2">Expert Teachers</p>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-white">10+</div>
                  <p className="text-primary-100 mt-2">Years Experience</p>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-white">100%</div>
                  <p className="text-primary-100 mt-2">Qualified</p>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-white">5000+</div>
                  <p className="text-primary-100 mt-2">Students Taught</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Teacher Detail Modal */}
      {selectedTeacher && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4"
          onClick={() => setSelectedTeacher(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative h-48 bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-2xl">
              <button
                onClick={() => setSelectedTeacher(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute -bottom-12 left-6">
                <div className="w-24 h-24 rounded-full bg-white shadow-lg overflow-hidden border-4 border-white">
                  {getImageUrl(selectedTeacher.image) ? (
                    <img
                      src={getImageUrl(selectedTeacher.image)}
                      alt={selectedTeacher.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(selectedTeacher.name) + '&background=3b82f6&color=fff';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-600 flex items-center justify-center">
                      <FiUser className="w-10 h-10 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="pt-16 p-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedTeacher.name}
              </h2>
              <p className="text-primary-600 font-medium mt-1">{selectedTeacher.position}</p>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center text-gray-600">
                  <FiMail className="w-5 h-5 mr-3 text-primary-500" />
                  <a href={`mailto:${selectedTeacher.email}`} className="hover:text-primary-600">
                    {selectedTeacher.email}
                  </a>
                </div>
                {selectedTeacher.phone && (
                  <div className="flex items-center text-gray-600">
                    <FiPhone className="w-5 h-5 mr-3 text-primary-500" />
                    <a href={`tel:${selectedTeacher.phone}`} className="hover:text-primary-600">
                      {selectedTeacher.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Biography</h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedTeacher.bio || `${selectedTeacher.name} is a dedicated ${selectedTeacher.position} with extensive experience in education. Committed to fostering a positive learning environment and helping students achieve their full potential.`}
                </p>
              </div>

              {/* Qualifications Section */}
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FiAward className="mr-2 text-primary-500" />
                  Qualifications
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <FiBookOpen className="w-4 h-4 mr-2 text-primary-400" />
                    Bachelor's Degree in Education
                  </li>
                  <li className="flex items-center text-gray-600">
                    <FiBookOpen className="w-4 h-4 mr-2 text-primary-400" />
                    Teaching Certification
                  </li>
                  <li className="flex items-center text-gray-600">
                    <FiBookOpen className="w-4 h-4 mr-2 text-primary-400" />
                    Advanced Training in {selectedTeacher.subject || 'Education'}
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setSelectedTeacher(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <a
                  href={`mailto:${selectedTeacher.email}`}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Contact Teacher
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;