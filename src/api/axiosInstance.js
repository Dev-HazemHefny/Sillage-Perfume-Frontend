import axios from 'axios';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to clean params
const cleanParams = (params) => {
  if (!params) return params;
  
  const cleaned = {};
  Object.keys(params).forEach((key) => {
    const value = params[key];
    // Only include non-empty values
    if (value !== '' && value !== null && value !== undefined) {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

// Request Interceptor - Add Token & Clean Params
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('🚀 Request:', config.method.toUpperCase(), config.url);
    
    // ✅ Clean empty params
    if (config.params) {
      config.params = cleanParams(config.params);
      console.log('🧹 Cleaned params:', config.params);
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle Errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response || error.message);
    
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          // Show validation errors if available
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach((err) => {
              toast.error(`${err.field || 'Error'}: ${err.message}`);
            });
          } else {
            toast.error(data.message || 'Bad request');
          }
          break;

        case 401:
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
          break;

        case 403:
          toast.error('You do not have permission.');
          break;

        case 404:
          toast.error(data.message || 'Resource not found.');
          break;

        case 500:
          toast.error('Server error. Please try again later.');
          break;

        default:
          toast.error(data.message || 'Something went wrong!');
      }
    } else if (error.request) {
      console.error('❌ Network Error - No response from server');
      toast.error('Network error. Check backend is running on http://localhost:5000');
    } else {
      toast.error('An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;