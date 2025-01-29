import axios from "axios";

const ApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
    baseURL: ApiUrl,
    withCredentials: true,  // Ensures cookies/auth tokens are sent with requests
});

// Request Interceptor to add the Authorization header to each request
axiosInstance.interceptors.request.use(
  (config) => {
    // Check if we're on the client-side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");  // Get the token from localStorage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;  // Add token to Authorization header
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
