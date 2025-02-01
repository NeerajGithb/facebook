import axios from "axios";

const ApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: ApiUrl,
});

// ✅ Attach JWT token to every request automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // 🔥 Get JWT from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ Attach token to headers
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
