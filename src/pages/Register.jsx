// frontend-user/src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiPhoneCall } from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';
import { registerStudent, getCourses } from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Register = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await getCourses();
      setCourses(response.data || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await registerStudent(data);
      toast.success(t('registrationSuccess'));
      reset();
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('studentRegistration')}</h1>
          <p className="text-gray-600">Please fill in all the required information to register</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">{t('personalInfo')}</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fullName')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('name', { required: 'Name is required' })}
                    type="text"
                    className="input-field pl-10"
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Full Name Khmer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fullNameKH')}
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('name_kh')}
                    type="text"
                    className="input-field pl-10 khmer-text"
                    placeholder="បញ្ចូលនាមពេញរបស់អ្នក"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('email')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="input-field pl-10"
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('phone')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('phone', { required: 'Phone number is required' })}
                    type="tel"
                    className="input-field pl-10"
                    placeholder="+855 XX XXX XXX"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('dateOfBirth')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('date_of_birth', { required: 'Date of birth is required' })}
                    type="date"
                    className="input-field pl-10"
                  />
                </div>
                {errors.date_of_birth && (
                  <p className="text-red-500 text-xs mt-1">{errors.date_of_birth.message}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('gender')} <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('gender', { required: 'Gender is required' })}
                  className="input-field"
                >
                  <option value="">Select gender</option>
                  <option value="male">{t('male')}</option>
                  <option value="female">{t('female')}</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('address')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    {...register('address', { required: 'Address is required' })}
                    rows="3"
                    className="input-field pl-10"
                    placeholder="Enter your address"
                  ></textarea>
                </div>
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                )}
              </div>

              {/* Course Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('selectCourse')} <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('course_id', { required: 'Please select a course' })}
                  className="input-field"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name} - ${course.fee} ({course.duration})
                    </option>
                  ))}
                </select>
                {errors.course_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.course_id.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary px-8 py-3 text-lg"
              >
                {submitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {t('loading')}
                  </div>
                ) : (
                  t('submit')
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;