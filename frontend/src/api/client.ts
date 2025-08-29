import axios, { AxiosResponse, AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor (for handling global errors)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle global errors
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Handle forbidden
      console.error('Access denied');
    } else if (error.response && error.response?.status >= 500) {
      // Handle server errors
      console.error('Server error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;