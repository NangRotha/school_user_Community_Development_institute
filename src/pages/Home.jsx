// frontend-user/src/pages/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiArrowRight, FiUsers, FiUserPlus, FiBookOpen, FiAward, 
  FiCalendar, FiMapPin, FiClock, FiTrendingUp, FiHeart,
  FiStar, FiBriefcase, FiGlobe, FiChevronRight, FiPlay,
  FiCheckCircle
} from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';
import { getBanners, getNews, getEvents, getSchoolInfo, getTeachers, getCourses } from '../services/api';
import BannerSlider from '../components/Home/BannerSlider';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { format } from 'date-fns';

const Home = () => {
  const { t } = useLanguage();
  const [banners, setBanners] = useState([]);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('news');
  const aboutRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bannersRes, newsRes, eventsRes, infoRes, teachersRes, coursesRes] = await Promise.all([
        getBanners(),
        getNews(6),
        getEvents(true, 4),
        getSchoolInfo(),
        getTeachers(),
        getCourses()
      ]);

      setBanners(bannersRes.data || []);
      setNews(newsRes.data || []);
      setEvents(eventsRes.data || []);
      setSchoolInfo(infoRes.data);
      
      const totalStudents = 1250;
      const totalTeachers = teachersRes.data?.length || 0;
      const totalCourses = coursesRes.data?.length || 0;
      const totalGraduates = 890;
      const satisfactionRate = 98;
      const yearsOfExcellence = 25;
      
      setStats({
        students: totalStudents,
        teachers: totalTeachers,
        courses: totalCourses,
        graduates: totalGraduates,
        satisfaction: satisfactionRate,
        years: yearsOfExcellence
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setEvents([]);
      setNews([]);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  // Fixed getImageUrl function with proper null checks
  const getImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') return null;
    // Fix spaces in filename
    let cleanPath = imagePath;
    if (cleanPath.includes(' ')) {
      cleanPath = cleanPath.replace(/ /g, '%20');
    }
    if (cleanPath.startsWith('http')) return cleanPath;
    return `http://localhost:8000${cleanPath}`;
  };

  const aboutImage = schoolInfo?.logo 
    ? getImageUrl(schoolInfo.logo)
    : 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3';

  if (loading) return <LoadingSpinner />;

  const testimonials = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Parent',
      content: 'Excellent school with dedicated teachers. My child has grown academically and personally since joining.',
      initial: 'JD'
    },
    {
      id: 2,
      name: 'Mary Smith',
      role: 'Parent',
      content: 'The facilities are amazing and the staff is very supportive. I highly recommend this school.',
      initial: 'MS'
    },
    {
      id: 3,
      name: 'David Chen',
      role: 'Alumni',
      content: 'This school prepared me well for university. The teachers truly care about student success.',
      initial: 'DC'
    }
  ];

  return (
    <div className="overflow-x-hidden">
      <BannerSlider banners={banners} />

      {/* Floating Stats Bar */}
      <div className="relative z-20 -mt-16 px-4">
        <div className="container-custom">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
              <div className="text-center group cursor-pointer">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-100 transition-all duration-300">
                  <FiUsers className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-800">{stats.students?.toLocaleString()}+</div>
                <div className="text-sm text-gray-500">{t('students')}</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-100 transition-all duration-300">
                  <FiUserPlus className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-800">{stats.teachers?.toLocaleString()}+</div>
                <div className="text-sm text-gray-500">{t('teachers')}</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-100 transition-all duration-300">
                  <FiBookOpen className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-800">{stats.courses?.toLocaleString()}+</div>
                <div className="text-sm text-gray-500">{t('courses')}</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-100 transition-all duration-300">
                  <FiAward className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-800">{stats.graduates?.toLocaleString()}+</div>
                <div className="text-sm text-gray-500">{t('graduates')}</div>
              </div>
              <div className="text-center group cursor-pointer hidden lg:block">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-100 transition-all duration-300">
                  <FiTrendingUp className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-800">{stats.satisfaction}%</div>
                <div className="text-sm text-gray-500">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section ref={aboutRef} className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <span className="inline-block px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-6">
                {stats.years}+ Years of Excellence
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                {schoolInfo?.name || 'Welcome to Our School'}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                {schoolInfo?.history || 'Providing quality education for over 25 years, we are committed to nurturing young minds and preparing them for a successful future.'}
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                    <FiCheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-600">Certified Teachers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                    <FiBriefcase className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-600">Modern Facilities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center">
                    <FiGlobe className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-600">Global Curriculum</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/about" className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 inline-flex items-center shadow-md">
                  Learn More 
                  <FiArrowRight className="ml-2" />
                </Link>
                <Link to="/register" className="bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300 inline-flex items-center">
                  Register Now
                  <FiChevronRight className="ml-2" />
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square lg:aspect-auto lg:h-[500px]">
                <img 
                  src={aboutImage}
                  alt={schoolInfo?.name || 'School'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                    <FiHeart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{stats.satisfaction}%</div>
                    <div className="text-xs text-gray-500">Parent Satisfaction</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <FiAward className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">#1</div>
                    <div className="text-xs text-gray-500">Top School</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the sections remain the same... */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-4">
              What's Happening
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Latest News & Events
            </h2>
            <p className="text-gray-600">
              Stay updated with the latest happenings at our school
            </p>
          </div>

          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-white rounded-full p-1 shadow-md">
              <button
                onClick={() => setSelectedTab('news')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedTab === 'news'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                Latest News
              </button>
              <button
                onClick={() => setSelectedTab('events')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedTab === 'events'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                Upcoming Events
              </button>
            </div>
          </div>

          {selectedTab === 'news' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.slice(0, 3).map((item) => (
                <Link key={item.id} to={`/news/${item.id}`} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="relative h-56 overflow-hidden">
                    {item.images && item.images[0] ? (
                      <img 
                        src={getImageUrl(item.images[0].image_url)}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                        <FiStar className="w-12 h-12 text-white/50" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3 mb-4">{item.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{item.view_count} views</span>
                        <span>By {item.author || 'Admin'}</span>
                      </div>
                      <span className="text-primary-600 font-semibold inline-flex items-center group-hover:translate-x-2 transition-transform">
                        Read More <FiArrowRight className="ml-1 w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {selectedTab === 'events' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.slice(0, 4).map((event) => (
                <Link key={event.id} to={`/events/${event.id}`} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row">
                  <div className="md:w-2/5 relative overflow-hidden h-48 md:h-auto">
                    {event.image_url ? (
                      <img 
                        src={getImageUrl(event.image_url)}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                        <FiCalendar className="w-12 h-12 text-white/50" />
                      </div>
                    )}
                  </div>
                  <div className="md:w-3/5 p-6">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary-600">
                          {event.start_date && format(new Date(event.start_date), 'dd')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {event.start_date && format(new Date(event.start_date), 'MMM')}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <FiClock className="w-4 h-4 mr-1" />
                          {event.start_date && format(new Date(event.start_date), 'h:mm a')}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FiMapPin className="w-4 h-4 mr-1" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{event.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-600 font-semibold text-sm inline-flex items-center group-hover:translate-x-2 transition-transform">
                        View Details <FiArrowRight className="ml-1 w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to={selectedTab === 'news' ? '/news' : '/events'} className="inline-flex items-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
              View All {selectedTab === 'news' ? 'News' : 'Events'}
              <FiArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-4">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Parents Say</h2>
            <p className="text-gray-600">Hear from our satisfied parents and students</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
                <svg className="w-10 h-10 text-primary-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{testimonial.initial}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Start Your Journey Today</h2>
            <p className="text-lg md:text-xl text-primary-100 mb-8">Join our community of learners and discover your potential. Quality education, modern facilities, and dedicated teachers await you.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl inline-flex items-center">
                Apply Now <FiArrowRight className="ml-2" />
              </Link>
              <Link to="/contact" className="border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-full transition-all duration-300 inline-flex items-center">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-100 transition-all duration-300">
                <FiBookOpen className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Quality Education</h3>
              <p className="text-gray-600 text-sm">Comprehensive curriculum designed for success</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-100 transition-all duration-300">
                <FiUsers className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Expert Teachers</h3>
              <p className="text-gray-600 text-sm">Qualified and experienced educators</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-100 transition-all duration-300">
                <FiAward className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Modern Facilities</h3>
              <p className="text-gray-600 text-sm">State-of-the-art learning environment</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-100 transition-all duration-300">
                <FiGlobe className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Global Recognition</h3>
              <p className="text-gray-600 text-sm">Internationally accredited programs</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;