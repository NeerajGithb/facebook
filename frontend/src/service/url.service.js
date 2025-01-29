import axios from "axios";
import Router from "next/router";

// Base URL from environment variable
const ApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: ApiUrl,
  withCredentials: true, // Ensures cookies/auth tokens are sent
  headers: {
    "Content-Type": "application/json", // Ensures correct request type
  },
});

// 🔹 Request Interceptor (Attach Authorization Token)
axiosInstance.interceptors.request.use(
  (config) => {
    // Check for `localStorage` availability on the client-side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Response Interceptor (Handle 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response, // Return response as is
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Redirecting to login...");

      // Check if we're on the client-side (to avoid window usage on server-side)
      if (typeof window !== "undefined") {
        localStorage.removeItem("token"); // Clear token on 401

        // Use Next.js Router for client-side navigation to login page
        Router.push("/user-login"); // Redirect to login page
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
