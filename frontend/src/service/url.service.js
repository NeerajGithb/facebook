import axios from "axios";

const ApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: ApiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the Authorization token to the request headers using an interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");  // Get the token from localStorage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;  // Add token to Authorization header
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
