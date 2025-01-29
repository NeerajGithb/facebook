import axios from "axios";

const ApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
    baseURL: ApiUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json", // Ensures correct request type
      },
});

export default axiosInstance;