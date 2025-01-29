import axios from "axios";

const ApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

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
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
            if (typeof window !== "undefined") {
                localStorage.removeItem("token"); // Clear token on 401
                window.location.href = "/user-login"; // Redirect to login page
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
