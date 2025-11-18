import axios from "axios";
import { MOVIE_API_BASE_URL } from "./config";

// Use backend proxy instead of direct TMDB API calls
const instance = axios.create({
  baseURL: MOVIE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 second timeout
});

// Request interceptor for adding auth token if needed
instance.interceptors.request.use(
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

// Response interceptor for error handling
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Ignore canceled requests (intentional cancellations)
    if (axios.isCancel(error) || 
        error.name === 'CanceledError' || 
        error.code === 'ERR_CANCELED' ||
        error.message === 'canceled') {
      // Silently ignore canceled requests
      return Promise.reject(error);
    }

    // Only log errors in development
    if (import.meta.env.DEV) {
      if (error.response) {
        // Server responded with error status
        console.error('API Error:', error.response.status, error.response.data);
      } else if (error.request) {
        // Request made but no response received
        console.error('Network Error:', error.request);
      } else {
        // Something else happened
        console.error('Error:', error.message);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
