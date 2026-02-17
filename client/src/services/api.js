import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) =>
    api.post('/auth/login', credentials).then(res => res.data),
  
  register: (userData) =>
    api.post('/auth/register', userData).then(res => res.data),
  
  getCurrentUser: () =>
    api.get('/auth/me').then(res => res.data),
  
  updateProfile: (profileData) =>
    api.put('/auth/profile', profileData).then(res => res.data),
  
  logout: () =>
    api.post('/auth/logout').then(res => res.data),
};

// Chat API
export const chatAPI = {
  getRooms: () =>
    api.get('/chat/rooms').then(res => res.data),
  
  createRoom: (roomData) =>
    api.post('/chat/rooms', roomData).then(res => res.data),
  
  getRoom: (roomId) =>
    api.get(`/chat/rooms/${roomId}`).then(res => res.data),
  
  joinRoom: (roomId) =>
    api.post(`/chat/rooms/${roomId}/join`).then(res => res.data),
  
  leaveRoom: (roomId) =>
    api.post(`/chat/rooms/${roomId}/leave`).then(res => res.data),
  
  getMessages: (roomId, page, limit) =>
    api.get(`/chat/rooms/${roomId}/messages`, { params: { page, limit } }).then(res => res.data),
  
  deleteMessage: (messageId) =>
    api.delete(`/chat/messages/${messageId}`).then(res => res.data),
};

// User API
export const userAPI = {
  searchUsers: (query, limit) =>
    api.get('/user/search', { params: { q: query, limit } }).then(res => res.data),
  
  getOnlineUsers: () =>
    api.get('/user/online').then(res => res.data),
  
  getUserProfile: (userId) =>
    api.get(`/user/${userId}`).then(res => res.data),
  
  updateSettings: (settings) =>
    api.put('/user/settings', settings).then(res => res.data),
};

export default api;
