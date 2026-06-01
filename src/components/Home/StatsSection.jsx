// frontend-user/src/components/Home/StatsSection.jsx
import React from 'react';
import { FiUsers, FiUserPlus, FiBookOpen, FiAward } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';

const StatsSection = ({ stats }) => {
  const { t } = useLanguage();
  
  const statItems = [
    { key: 'students', icon: FiUsers, value: stats?.students || 0, label: t('students') },
    { key: 'teachers', icon: FiUserPlus, value: stats?.teachers || 0, label: t('teachers') },
    { key: 'courses', icon: FiBookOpen, value: stats?.courses || 0, label: t('courses') },
    { key: 'graduates', icon: FiAward, value: stats?.graduates || 0, label: t('graduates') },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statItems.map((item) => (
            <div key={item.key} className="text-center text-white">
              <item.icon className="w-12 h-12 mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-bold">{item.value.toLocaleString()}+</div>
              <div className="text-sm opacity-90 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;