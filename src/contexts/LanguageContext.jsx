// frontend-user/src/contexts/LanguageContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  // Provide default values if context is undefined
  if (!context) {
    return {
      language: 'en',
      setLanguage: () => {},
      t: (key) => key
    };
  }
  return context;
};

const translations = {
  en: {
    home: 'Home',
    about: 'About Us',
    courses: 'Courses',
    news: 'News',
    events: 'Events',
    gallery: 'Gallery',
    teachers: 'Teachers',
    results: 'Exam Results',
    register: 'Register',
    contact: 'Contact',
    welcome: 'Welcome to',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    students: 'Students',
    graduates: 'Graduates',
    latestNews: 'Latest News',
    viewAll: 'View All',
    upcomingEvents: 'Upcoming Events',
    registerNow: 'Register Now',
    aboutSchool: 'About the School',
    quickLinks: 'Quick Links',
    contactUs: 'Contact Us',
    followUs: 'Follow Us',
    copyright: 'All rights reserved',
    searchResults: 'Search Exam Results',
    enterStudentName: 'Enter student name',
    search: 'Search',
    examName: 'Exam Name',
    subject: 'Subject',
    score: 'Score',
    grade: 'Grade',
    loading: 'Loading...',
    error: 'Error loading data',
    noData: 'No data available',
    aboutTitle: 'About Our School',
    aboutSubtitle: 'Learn more about our mission and vision',
    noEvents: 'No upcoming events',
    readMore: 'Read More',
    heroTitle: 'Quality Education for Better Future',
    heroSubtitle: 'Empowering students with knowledge and skills for success in the 21st century',
    personalInfo: 'Personal Information',
    fullName: 'Full Name',
    fullNameKH: 'Full Name (Khmer)',
    email: 'Email',
    phone: 'Phone Number',
    address: 'Address',
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    selectCourse: 'Select Course',
    submit: 'Submit Registration',
    registrationSuccess: 'Registration submitted successfully! We will contact you soon.',
     views: 'views',
  author: 'Author',
  morePhotos: 'More Photos',
  leaveComment: 'Leave a comment',
  share: 'Share',
  tags: 'Tags',
  schoolNews: 'School News',
  announcement: 'Announcement',
  backToNews: 'Back to News',
  backToTop: 'Back to Top',
  stayUpdated: 'Stay updated with the latest news and announcements from our school',
  noImage: 'No Image',
  noNews: 'No news available at the moment.',
  newsNotFound: 'News Not Found',
  newsNotFoundDesc: 'The article you\'re looking for doesn\'t exist or has been removed.',
  },
  kh: {
    home: 'ទំព័រដើម',
    about: 'អំពីយើង',
    courses: 'មុខវិជ្ជា',
    news: 'ព័ត៌មាន',
    events: 'ព្រឹត្តិការណ៍',
    gallery: 'វិចិត្រសាល',
    teachers: 'គ្រូបង្រៀន',
    results: 'លទ្ធផលប្រឡង',
    register: 'ចុះឈ្មោះ',
    contact: 'ទំនាក់ទំនង',
    welcome: 'ស្វាគមន៍មកកាន់',
    getStarted: 'ចាប់ផ្តើម',
    learnMore: 'ស្វែងយល់បន្ថែម',
    students: 'សិស្សានុសិស្ស',
    graduates: 'និស្សិតបញ្ចប់ការសិក្សា',
    latestNews: 'ព័ត៌មានថ្មីៗ',
    viewAll: 'មើលទាំងអស់',
    upcomingEvents: 'ព្រឹត្តិការណ៍នាពេលខាងមុខ',
    registerNow: 'ចុះឈ្មោះឥឡូវនេះ',
    aboutSchool: 'អំពីសាលា',
    quickLinks: 'តំណភ្ជាប់រហ័ស',
    contactUs: 'ទំនាក់ទំនងមកយើង',
    followUs: 'តាមដានយើង',
    copyright: 'រក្សាសិទ្ធិគ្រប់យ៉ាង',
    searchResults: 'ស្វែងរកលទ្ធផលប្រឡង',
    enterStudentName: 'បញ្ចូលឈ្មោះសិស្ស',
    search: 'ស្វែងរក',
    examName: 'ឈ្មោះប្រឡង',
    subject: 'មុខវិជ្ជា',
    score: 'ពិន្ទុ',
    grade: 'ថ្នាក់',
    loading: 'កំពុងផ្ទុក...',
    error: 'កំហុសក្នុងការផ្ទុកទិន្នន័យ',
    noData: 'គ្មានទិន្នន័យ',
    aboutTitle: 'អំពីសាលារបស់យើង',
    aboutSubtitle: 'ស្វែងយល់បន្ថែមអំពីបេសកកម្ម និងចក្ខុវិស័យរបស់យើង',
    noEvents: 'គ្មានព្រឹត្តិការណ៍',
    readMore: 'អានបន្ថែម',
    heroTitle: 'ការអប់រំប្រកបដោយគុណភាពសម្រាប់អនាគតដ៏ល្អប្រសើរ',
    heroSubtitle: 'ផ្តល់អំណាចដល់សិស្សានុសិស្សនូវចំណេះដឹង និងជំនាញសម្រាប់ភាពជោគជ័យក្នុងសតវត្សរ៍ទី២១',
    personalInfo: 'ព័ត៌មានផ្ទាល់ខ្លួន',
    fullName: 'នាមត្រកូល និងនាមខ្លួន',
    fullNameKH: 'នាមត្រកូល និងនាមខ្លួន (ជាភាសាខ្មែរ)',
    email: 'អ៊ីមែល',
    phone: 'លេខទូរស័ព្ទ',
    address: 'អាសយដ្ឋាន',
    dateOfBirth: 'ថ្ងៃខែឆ្នាំកំណើត',
    gender: 'ភេទ',
    male: 'ប្រុស',
    female: 'ស្រី',
    selectCourse: 'ជ្រើសរើសមុខវិជ្ជា',
    submit: 'ដាក់ពាក្យស្នើសុំ',
    registrationSuccess: 'ពាក្យស្នើសុំរបស់អ្នកត្រូវបានដាក់ជូនដោយជោគជ័យ! យើងនឹងទាក់ទងអ្នកឆាប់ៗ។',
    views: 'ទស្សនា',
    author: 'អ្នកនិពន្ធ',
    morePhotos: 'រូបភាពបន្ថែម',
    leaveComment: 'ទុកមតិយោបល់',
    share: 'ចែករំលែក',
    tags: 'ស្លាក',
    schoolNews: 'ព័ត៌មានសាលា',
    announcement: 'សេចក្តីជូនដំណឹង',
    backToNews: 'ត្រឡប់ទៅព័ត៌មាន',
    backToTop: 'ត្រឡប់ទៅកំពូល',
    stayUpdated: 'តាមដានព័ត៌មានថ្មីៗ និងសេចក្តីជូនដំណឹងពីសាលារបស់យើង',
    noImage: 'គ្មានរូបភាព',
    noNews: 'មិនមានព័ត៌មាននៅពេលនេះទេ។',
    newsNotFound: 'រកមិនឃើញព័ត៌មាន',
    newsNotFoundDesc: 'អត្ថបទដែលអ្នកកំពុងស្វែងរកមិនមានទេ ឬត្រូវបានលុបចោល។',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved === 'kh' ? 'kh' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};