// frontend-user/src/components/Common/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const HeroSection = ({ title, subtitle, backgroundImage }) => {
  const { t } = useLanguage();

  return (
    <div className="relative h-[500px] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative text-center text-white z-10 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">{title}</h1>
        <p className="text-lg md:text-xl mb-8 animate-slide-up">{subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="btn-primary">{t('getStarted')}</Link>
          <Link to="/about" className="btn-secondary">{t('learnMore')}</Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;