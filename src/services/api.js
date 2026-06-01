// frontend-user/src/services/api.js
import axios from 'axios';

// Use localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

console.log('🔧 API_BASE_URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API methods - Public endpoints (no auth required)
export const getSchoolInfo = () => api.get('/school/info');
export const getBanners = () => api.get('/school/banners');
export const getNews = (limit = 6) => api.get(`/news/latest?limit=${limit}`);
export const getAllNews = () => api.get('/news');
export const getNewsById = (id) => api.get(`/news/${id}`);
export const getEvents = (upcoming = true, limit = 10) => {
  const params = new URLSearchParams();
  params.append('upcoming', upcoming.toString());
  params.append('limit', limit.toString());
  return api.get(`/events?${params.toString()}`);
};
export const getEventById = (id) => api.get(`/events/${id}`);
export const getTeachers = () => api.get('/teachers');
export const getCourses = () => api.get('/courses');
export const getGallery = (category = null) => {
  const url = category ? `/gallery?category=${category}` : '/gallery';
  return api.get(url);
};
export const searchResults = (studentName) => {
  return api.get(`/results/search?student_name=${encodeURIComponent(studentName)}`);
};
export const registerStudent = (data) => api.post('/students', data);
export const getAbout = () => api.get('/about');
export const sendContactMessage = (data) => api.post('/contacts', data);
export const getStudents = () => api.get('/students');

// Export the api instance as default
export default api;