import axiosInstance from "./url.service"

//signUp user
export const registerUser = async(userData)=>{
    try {
        const response= await axiosInstance.post('/auth/register',userData);
            return response.data
    } catch (error) {
         console.log(error)
    }
}

//login user
export const loginUser = async(userData)=>{
    try {
        const response= await axiosInstance.post('/auth/login',userData);
            return response.data
    } catch (error) {
         console.log(error)
    }
}


//login user
export const logout = async()=>{
    try {
        const response= await axiosInstance.get('/auth/logout');
            return response.data
    } catch (error) {
         console.log(error)
    }
}


//check auth api
export const checkUserAuth = async () => {
    try {
        const response = await axiosInstance.get("users/check-auth");

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

