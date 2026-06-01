// frontend-user/src/components/Layout/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiMenu, FiX, FiHome, FiInfo, FiBookOpen, FiFileText, 
  FiCalendar, FiImage, FiUsers, FiBarChart2, FiMail, FiEdit3,
  FiChevronDown, FiGlobe
} from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../Common/LanguageSwitcher';
import { getSchoolInfo } from '../../services/api';

const Header = () => {
  const { t = (key) => key } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [logoError, setLogoError] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetchSchoolInfo();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchSchoolInfo = async () => {
    try {
      const response = await getSchoolInfo();
      console.log('School Info Response:', response.data);
      setSchoolInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch school info:', error);
    }
  };

  const handleScroll = () => {
    setScrolled(window.scrollY > 20);
  };

  // Updated getLogoUrl function with timestamp to bypass cache
  const getLogoUrl = () => {
    // Get logo from schoolInfo
    if (!schoolInfo?.logo || logoError) return null;
    if (typeof schoolInfo.logo !== 'string') return null;
    
    let cleanPath = schoolInfo.logo;
    
    // Add timestamp to bypass cache
    const timestamp = new Date().getTime();
    const separator = cleanPath.includes('?') ? '&' : '?';
    
    // If it's already an HTTP URL, return as is with timestamp
    if (cleanPath.startsWith('http')) {
      return `${cleanPath}${separator}t=${timestamp}`;
    }
    
    // Clean up local path
    if (cleanPath.includes(' ')) {
      cleanPath = cleanPath.replace(/ /g, '%20');
    }
    
    // Remove duplicate slashes
    cleanPath = cleanPath.replace(/\/+/g, '/');
    
    // Ensure path starts with /
    if (!cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath;
    }
    
    return `http://localhost:8000${cleanPath}${separator}t=${timestamp}`;
  };

  const navItems = [
    { name: 'home', path: '/', icon: FiHome },
    { name: 'about', path: '/about', icon: FiInfo },
    { 
      name: 'academics', 
      icon: FiBookOpen,
      dropdown: [
        { name: 'courses', path: '/courses', icon: FiBookOpen },
        { name: 'teachers', path: '/teachers', icon: FiUsers },
        { name: 'results', path: '/results', icon: FiBarChart2 },
      ]
    },
    { 
      name: 'media', 
      icon: FiFileText,
      dropdown: [
        { name: 'news', path: '/news', icon: FiFileText },
        { name: 'events', path: '/events', icon: FiCalendar },
        { name: 'gallery', path: '/gallery', icon: FiImage },
      ]
    },
    { name: 'register', path: '/register', icon: FiEdit3 },
    { name: 'contact', path: '/contact', icon: FiMail },
  ];

  const isActive = (path) => location.pathname === path;

  const logoUrl = getLogoUrl();

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-sm py-3' 
          : 'bg-white/95 backdrop-blur-sm border-b border-gray-100 py-4'
      }`}>
        <div className="container-custom">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-3 group">
              {/* Logo Image */}
              {logoUrl && !logoError ? (
                <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
                  <img 
                    src={logoUrl}
                    alt={schoolInfo?.name || 'School Logo'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Logo failed to load:', logoUrl);
                      setLogoError(true);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <span className="text-white font-bold text-xl">
                    {schoolInfo?.name ? schoolInfo.name.charAt(0).toUpperCase() : 'S'}
                  </span>
                </div>
              )}
              
              {/* School Name */}
              <div>
                <h1 className={`font-bold text-xl tracking-tight transition-colors duration-300 ${
                  scrolled ? 'text-gray-800' : 'text-gray-800'
                }`}>
                  {schoolInfo?.name || 'School Name'}
                </h1>
                {schoolInfo?.name_kh && (
                  <p className={`text-xs transition-colors duration-300 text-gray-500 khmer-text ${
                    scrolled ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {schoolInfo.name_kh}
                  </p>
                )}
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.dropdown ? (
                    <div
                      onMouseEnter={() => setOpenDropdown(item.name)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button
                        className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          openDropdown === item.name
                            ? 'text-primary-600 bg-primary-50'
                            : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{t(item.name) || item.name}</span>
                        <FiChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                          openDropdown === item.name ? 'rotate-180' : ''
                        }`} />
                      </button>

                      {/* Dropdown */}
                      {openDropdown === item.name && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 animate-fade-in z-50">
                          {item.dropdown.map((sub) => (
                            <Link
                              key={sub.path}
                              to={sub.path}
                              className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${
                                isActive(sub.path)
                                  ? 'text-primary-600 bg-primary-50'
                                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                              }`}
                            >
                              <sub.icon className="w-4 h-4" />
                              <span>{t(sub.name) || sub.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive(item.path)
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{t(item.name) || item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
              <div className="ml-2 pl-2 border-l border-gray-200">
                <LanguageSwitcher />
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-xl animate-slide-in-right">
            <div className="flex items-center justify-between p-5 border-b">
              <div className="flex items-center space-x-3">
                {logoUrl && !logoError ? (
                  <img 
                    src={logoUrl}
                    alt="Logo"
                    className="w-8 h-8 rounded-lg object-cover"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {schoolInfo?.name ? schoolInfo.name.charAt(0).toUpperCase() : 'S'}
                    </span>
                  </div>
                )}
                <span className="font-semibold text-gray-800">{schoolInfo?.name || 'Menu'}</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 space-y-1 overflow-y-auto h-full pb-24">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {t(item.name) || item.name}
                      </div>
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                            isActive(sub.path)
                              ? 'bg-primary-50 text-primary-600'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <sub.icon className="w-4 h-4" />
                          <span>{t(sub.name) || sub.name}</span>
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{t(item.name) || item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 mt-4 border-t">
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;