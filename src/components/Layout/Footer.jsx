// frontend-user/src/components/Layout/Footer.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMapPin, FiPhone, FiMail, FiFacebook, FiTwitter, 
  FiLinkedin, FiInstagram, FiClock, FiSend, FiHeart,
  FiChevronRight
} from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import { getSchoolInfo } from '../../services/api';

const Footer = () => {
  const { t = (key) => key } = useLanguage();
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [logoError, setLogoError] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchSchoolInfo();
  }, []);

  const fetchSchoolInfo = async () => {
    try {
      const response = await getSchoolInfo();
      setSchoolInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch school info:', error);
    }
  };

   // Fixed getLogoUrl function with proper null checks
   const getLogoUrl = () => {
     if (!schoolInfo?.logo || logoError) return null;
     if (typeof schoolInfo.logo !== 'string') return null;
     let cleanPath = schoolInfo.logo;
     if (cleanPath.includes(' ')) {
       cleanPath = cleanPath.replace(/ /g, '%20');
     }
     if (cleanPath.startsWith('http')) return cleanPath;
     const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://school-backend-community-development.onrender.com/api';
     return `${apiBaseUrl.replace('/api', '')}${cleanPath}`;
   };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with: ${email}`);
      setEmail('');
    }
  };

  const quickLinks = [
    { path: '/', label: t('home') || 'Home' },
    { path: '/about', label: t('about') || 'About Us' },
    { path: '/courses', label: t('courses') || 'Courses' },
    { path: '/news', label: t('news') || 'News' },
    { path: '/events', label: t('events') || 'Events' },
    { path: '/gallery', label: t('gallery') || 'Gallery' },
    { path: '/teachers', label: t('teachers') || 'Teachers' },
    { path: '/register', label: t('register') || 'Register' },
  ];

  const contactInfo = [
    { icon: FiMapPin, text: '123 Education Street, Phnom Penh, Cambodia', link: null },
    { icon: FiPhone, text: '+855 12 345 678', link: 'tel:+85512345678' },
    { icon: FiPhone, text: '+855 98 765 432', link: 'tel:+85598765432' },
    { icon: FiMail, text: 'info@school.edu.kh', link: 'mailto:info@school.edu.kh' },
    { icon: FiClock, text: 'Mon - Fri: 8:00 AM - 5:00 PM', link: null },
  ];

  const socialLinks = [
    { icon: FiFacebook, url: 'https://facebook.com', color: 'hover:text-blue-500' },
    { icon: FiTwitter, url: 'https://twitter.com', color: 'hover:text-sky-500' },
    { icon: FiInstagram, url: 'https://instagram.com', color: 'hover:text-pink-500' },
    { icon: FiLinkedin, url: 'https://linkedin.com', color: 'hover:text-blue-600' },
  ];

  const logoUrl = getLogoUrl();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="pt-16 pb-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            
            {/* About Section */}
            <div>
              <div className="flex items-center space-x-3 mb-5">
                {logoUrl ? (
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
                    <img 
                      src={logoUrl}
                      alt={schoolInfo?.name || 'Logo'} 
                      className="w-full h-full object-cover"
                      onError={() => setLogoError(true)}
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {schoolInfo?.name ? schoolInfo.name.charAt(0).toUpperCase() : 'S'}
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-white">
                  {schoolInfo?.name || 'School Name'}
                </h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                {schoolInfo?.history || 'Providing quality education for a better future. We are committed to nurturing young minds and preparing them for success.'}
              </p>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 transition-all duration-300 ${social.color} hover:bg-gray-700 hover:scale-110`}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-5 flex items-center">
                <span className="w-8 h-0.5 bg-primary-500 mr-3"></span>
                {t('quickLinks') || 'Quick Links'}
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path} 
                      className="text-gray-400 hover:text-primary-400 transition-all duration-300 text-sm flex items-center group"
                    >
                      <FiChevronRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 -translate-x-2" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-5 flex items-center">
                <span className="w-8 h-0.5 bg-primary-500 mr-3"></span>
                {t('contactUs') || 'Contact Us'}
              </h3>
              <ul className="space-y-3">
                {contactInfo.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3 group">
                    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 transition-colors duration-300">
                      <item.icon className="w-4 h-4 text-primary-400 group-hover:text-white transition-colors" />
                    </div>
                    {item.link ? (
                      <a 
                        href={item.link} 
                        className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">{item.text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-5 flex items-center">
                <span className="w-8 h-0.5 bg-primary-500 mr-3"></span>
                Newsletter
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Subscribe to get updates about our school events and news.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-300"
                    required
                  />
                  <FiMail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  <span>Subscribe</span>
                  <FiSend className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-3">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-800 py-6">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} {schoolInfo?.name || 'School Name'}. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-600">|</span>
              <Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors">
                Terms of Service
              </Link>
              <span className="text-gray-600">|</span>
              <Link to="/sitemap" className="text-gray-400 hover:text-primary-400 transition-colors">
                Sitemap
              </Link>
            </div>
            <p className="text-xs text-gray-500 flex items-center">
              Made with <FiHeart className="w-3 h-3 text-red-500 mx-1 animate-pulse" /> for education
            </p>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-40 opacity-90 hover:opacity-100"
      >
        <FiChevronRight className="w-5 h-5 rotate-270 transform -rotate-90" />
      </button>
    </footer>
  );
};

export default Footer;