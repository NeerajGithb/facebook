import axiosInstance from "./url.service";

// ✅ Register User
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Register Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Login User
export const loginUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/login", userData);
    if (response.data?.data?.token) {
      // Store the token in localStorage
      localStorage.setItem("token", response.data.data.token); // Use "jwtToken" as key
    }
    console.log(response.data);
    return response.data;
    
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Logout User
export const logout = async () => {
  try {
    localStorage.removeItem("token"); // Remove JWT from localStorage
    console.log("Token removed from localStorage");

    // Return a success status with a message
    return { status: "success", message: "Logged out successfully" };
  } catch (error) {
    console.error("Logout Error:", error.response?.data || error.message);
    throw error;
  }
};



// ✅ Check User Authentication
export const checkUserAuth = async () => {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (token) {
      // Proceed with the request if a token exists
      const response = await axiosInstance.get("/users/check-auth", {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token if it exists
        },
        withCredentials: true, // Ensure credentials are sent
      });

      if (response.status === 200 && response.data.status === "success") {
        console.log("User authenticated:", response.data); // Debug log for successful authentication
        return { isAuthenticated: true, user: response?.data?.data };
      }
    } else {
      console.warn("No token found in localStorage");
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn("User is not authenticated");
    } else {
      console.error("Auth Check Error:", error.response?.data || error.message);
    }
  }

  return { isAuthenticated: false };
};
