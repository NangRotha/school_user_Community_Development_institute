// frontend-user/src/components/Common/LanguageSwitcher.jsx
import React from 'react';
import { FiGlobe } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'kh' : 'en')}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-all duration-200"
    >
      <FiGlobe className="w-4 h-4" />
      <span>{language === 'en' ? 'ខ្មែរ' : 'EN'}</span>
    </button>
  );
};

export default LanguageSwitcher;