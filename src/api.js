import axios from "axios";

// Create Axios instance with default configuration
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies with requests
  timeout: 10000, // Set request timeout to 10 seconds
});

// Variable to track ongoing refresh token requests
let refreshPromise = null;

// Extract cookie value by name from document.cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

// Request interceptor to add Authorization header with access token
api.interceptors.request.use(
  (config) => {
    const accessToken = getCookie("user_access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle 401 errors and token refresh
api.interceptors.response.use(
  (response) => response, // Pass successful responses unchanged
  async (error) => {
    const originalRequest = error.config;
    const isRefreshEndpoint = originalRequest.url.includes("/auth/refresh/");
    const isLoginEndpoint = originalRequest.url.includes("/auth/login/");
    const isLogoutEndpoint = originalRequest.url.includes("/auth/logout/");

    // Skip retry logic for auth endpoints or if already retried
    if (
      isLoginEndpoint ||
      isRefreshEndpoint ||
      isLogoutEndpoint ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // Handle unauthorized errors (401)
    if (error.response?.status === 401) {
      if (!refreshPromise) {
        // Initiate token refresh if not already in progress
        refreshPromise = api
          .post("/auth/refresh/")
          .then(() => {
            refreshPromise = null; // Reset promise on success
          })
          .catch((err) => {
            refreshPromise = null; // Reset promise on failure
            return Promise.reject(err);
          });
      }

      try {
        // Wait for refresh to complete and retry original request
        await refreshPromise;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // Reject all other errors
    return Promise.reject(error);
  },
);

export default api;
