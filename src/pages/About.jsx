// frontend-user/src/pages/About.jsx
import React, { useState, useEffect } from 'react';
import { FiFlag, FiHeart, FiTarget, FiUsers, FiEye, FiCheckCircle, FiBriefcase, FiGlobe } from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';
import { getAbout } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const About = () => {
  const { t, language } = useLanguage();
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await getAbout();
      setAbout(response.data);
    } catch (error) {
      console.error('Failed to fetch about:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fixed getImageUrl function with proper null checks
  const getImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') return null;
    let cleanPath = imagePath;
    if (cleanPath.includes(' ')) {
      cleanPath = cleanPath.replace(/ /g, '%20');
    }
    if (cleanPath.startsWith('http')) return cleanPath;
    return `http://localhost:8000${cleanPath}`;
  };

  if (loading) return <LoadingSpinner />;

  const title = language === 'kh' && about?.title_kh ? about.title_kh : about?.title || 'About Us';
  const content = language === 'kh' && about?.content_kh ? about.content_kh : about?.content || '';
  const mission = language === 'kh' && about?.mission_kh ? about.mission_kh : about?.mission || '';
  const vision = language === 'kh' && about?.vision_kh ? about.vision_kh : about?.vision || '';
  const imageUrl = getImageUrl(about?.image_url);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn more about our mission, vision, and values
          </p>
        </div>

        {/* About Image */}
        {imageUrl && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
            <img 
              src={imageUrl}
              alt={title}
              className="w-full h-[400px] object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3';
              }}
            />
          </div>
        )}

        {/* Content Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 mb-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {content || 'We are committed to providing quality education and nurturing young minds for a better future.'}
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl shadow-lg p-8 border border-primary-100">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <FiTarget className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              {mission || 'To provide quality education that empowers students with knowledge, skills, and values for success in a changing world.'}
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl shadow-lg p-8 border border-primary-100">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <FiEye className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              {vision || 'To be a leading educational institution recognized for excellence, innovation, and community impact.'}
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiHeart className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Excellence</h3>
              <p className="text-gray-600">Striving for the highest standards in everything we do</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Community</h3>
              <p className="text-gray-600">Building strong relationships and fostering collaboration</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiFlag className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Innovation</h3>
              <p className="text-gray-600">Embracing new ideas and technologies for better learning</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">25+</div>
              <p className="text-primary-100 mt-2">Years of Excellence</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">5000+</div>
              <p className="text-primary-100 mt-2">Students Graduated</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">100+</div>
              <p className="text-primary-100 mt-2">Expert Teachers</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">50+</div>
              <p className="text-primary-100 mt-2">Awards Won</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;