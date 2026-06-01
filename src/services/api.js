// frontend-user/src/services/api.js
import axios from 'axios';

// Use environment variable for API URL
// For production on Render, use the Render URL
// For development, use localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://school-backend-community-development.onrender.com/api';

console.log('🔧 API_BASE_URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds timeout for Render free tier cold start
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    // Handle 401 Unauthorized - clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Handle 503 Service Unavailable - Render free tier cold start
    if (error.response?.status === 503) {
      console.warn('⚠️ Backend is waking up (cold start). Please try again in a moment.');
    }
    
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout - Backend may be waking up from cold start');
    }
    
    if (!error.response) {
      console.error('🌐 Network Error - Cannot connect to server');
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// API Methods - Public Endpoints (No Auth Required)
// ============================================

// School Information
export const getSchoolInfo = () => api.get('/school/info');
export const getBanners = () => api.get('/school/banners');

// News
export const getNews = (limit = 6) => api.get(`/news/latest?limit=${limit}`);
export const getAllNews = () => api.get('/news');
export const getNewsById = (id) => api.get(`/news/${id}`);

// Events
export const getEvents = (upcoming = true, limit = 10) => {
  const params = new URLSearchParams();
  params.append('upcoming', upcoming.toString());
  params.append('limit', limit.toString());
  return api.get(`/events?${params.toString()}`);
};
export const getEventById = (id) => api.get(`/events/${id}`);

// Teachers & Courses
export const getTeachers = () => api.get('/teachers');
export const getCourses = () => api.get('/courses');

// Gallery
export const getGallery = (category = null) => {
  const url = category ? `/gallery?category=${category}` : '/gallery';
  return api.get(url);
};

// Exam Results
export const searchResults = (studentName) => {
  return api.get(`/results/search?student_name=${encodeURIComponent(studentName)}`);
};

// Student Registration
export const registerStudent = (data) => api.post('/students', data);

// About Page
export const getAbout = () => api.get('/about');

// Contact Messages
export const sendContactMessage = (data) => api.post('/contacts', data);

// Students List (for admin)
export const getStudents = () => api.get('/students');

// ============================================
// Export api instance as default
// ============================================
export default api;