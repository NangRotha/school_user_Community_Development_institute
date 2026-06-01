// frontend-user/src/pages/Students.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiCalendar, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';
import { getStudents } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Students = () => {
  const { t } = useLanguage();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await getStudents();
      setStudents(response.data || []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Students
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet our talented and dedicated student community
          </p>
        </div>

        {students.length === 0 ? (
          <div className="text-center py-12">
            <FiUsers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No student information available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {students.map((student) => (
              <div key={student.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary-600 text-2xl font-bold">
                      {student.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-center">{student.name}</h3>
                  {student.name_kh && (
                    <p className="text-primary-100 text-center text-sm">{student.name_kh}</p>
                  )}
                </div>
                <div className="p-5">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <FiMail className="mr-3 text-primary-500" />
                      <span className="text-sm">{student.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiPhone className="mr-3 text-primary-500" />
                      <span className="text-sm">{student.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiCalendar className="mr-3 text-primary-500" />
                      <span className="text-sm">
                        {student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiMapPin className="mr-3 text-primary-500" />
                      <span className="text-sm">{student.address || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      student.status === 'approved' ? 'bg-green-100 text-green-800' :
                      student.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.status || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;