import { AxiosRequestConfig } from 'axios';
import apiClient from '../client';
import { tokenStorage } from '../../utils/tokenStorage';

class ApiService {
  private refreshTokenPromise: Promise<string> | null = null;

  constructor() {
    this.setupAuthInterceptors();
  }

  private setupAuthInterceptors(): void {
    // Request interceptor to add auth token
    apiClient.interceptors.request.use(
      (config) => {
        const tokens = tokenStorage.getTokens();
        if (tokens?.accessToken) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Enhanced response interceptor to handle token refresh
    // Clear existing response interceptors and add our enhanced one
    apiClient.interceptors.response.clear();
    
    apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle token refresh for 401 errors
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newAccessToken = await this.refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clean up and redirect
            tokenStorage.removeTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // Keep your existing error handling logic
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          tokenStorage.removeTokens();
          window.location.href = '/login';
        } else if (error.response?.status === 403) {
          console.error('Access denied');
        } else if (error.response && error.response?.status >= 500) {
          console.error('Server error:', error.message);
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    const tokens = tokenStorage.getTokens();
    if (!tokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    this.refreshTokenPromise = apiClient
      .post('/auth/refresh', { refreshToken: tokens.refreshToken })
      .then((response) => {
        const newTokens = response.data;
        tokenStorage.setTokens(newTokens);
        this.refreshTokenPromise = null;
        return newTokens.accessToken;
      })
      .catch((error) => {
        this.refreshTokenPromise = null;
        throw error;
      });

    return this.refreshTokenPromise;
  }

  // Authentication methods
  async login(email: string, password: string) {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  }
  async logout() {
    const tokens = tokenStorage.getTokens();
    if (tokens?.refreshToken) {
      try {
        await apiClient.post('/auth/logout', { refreshToken: tokens.refreshToken });
      } catch (error) {
        console.warn('Logout request failed:', error);
      }
    }
    tokenStorage.removeTokens();
    // Also remove the old authToken for backward compatibility
    localStorage.removeItem('authToken');
  }

  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }

  // Generic API methods using your apiClient
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.delete(url, config);
    return response.data;
  }

  // Method to get the underlying apiClient for direct use if needed
  getClient() {
    return apiClient;
  }
}
export const apiService = new ApiService();