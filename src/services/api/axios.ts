import axios from 'axios';
import { apiConfig } from '@/config/api';

const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
  withCredentials: true, // Important for cookies
});

// Request interceptor - cookies are sent automatically with withCredentials: true
apiClient.interceptors.request.use(
  (config) => {
    // No need to manually set Authorization header when using cookies
    // Backend will read from cookie
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token endpoint will read from cookie automatically
        await axios.post(
          `${apiConfig.baseURL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          }
        );

        // New cookies are set automatically by the backend
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
