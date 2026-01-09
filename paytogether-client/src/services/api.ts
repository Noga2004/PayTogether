import axios from 'axios';

const API_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors properly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Error intercepted:', error);
    console.log('Error response:', error.response);
    console.log('Error data:', error.response?.data);
    // Re-throw the error so it can be caught by the calling code
    return Promise.reject(error);
  }
);

export default api;