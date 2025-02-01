import axiosInstance from "./url.service";

// ✅ Register User
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Register Error:", error);
    throw error;
  }
};

// ✅ Login User
export const loginUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/login", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token); // 🔥 Store JWT
    }
    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

// ✅ Logout User
export const logout = async () => {
  try {
    localStorage.removeItem("token"); // 🔥 Remove JWT
    return { message: "Logged out successfully" };
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
};

// ✅ Check User Authentication
export const checkUserAuth = async () => {
  try {
    const response = await axiosInstance.get("/users/check-auth");
    if (response.status === 200 && response.data.status === "success") {
      return { isAuthenticated: true, user: response?.data?.data };
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn("User is not authenticated");
    } else {
      console.error("Auth Check Error:", error);
    }
  }

  return { isAuthenticated: false };
};
