import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  getMe: () => api.get('/auth/me'),
};

// Complaints API
export const complaintsAPI = {
  getCategories: () => api.get('/complaints/categories'),
  createComplaint: (complaintData) => api.post('/complaints', complaintData),
  getMyComplaints: (status) => api.get(`/complaints/my${status ? `?status=${status}` : ''}`),
  getAllComplaints: (params) => api.get('/complaints/all', { params }),
  updateComplaintStatus: (id, statusData) => api.put(`/complaints/${id}/status`, statusData),
  addFeedback: (id, feedbackData) => api.put(`/complaints/${id}/feedback`, feedbackData),
  getStats: () => api.get('/complaints/stats'),
};

export default api;