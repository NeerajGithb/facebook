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
      const response = await axiosInstance.get('users/check-auth');
  
      // Check if the response indicates success
      if (response.data.status === 'success') {
        return { isAuthenticated: true, user: response.data.data };
      } else {
        // If status is something else (not 'success'), return false
        console.log('Authentication failed:', response.data.message || 'Unknown error');
        return { isAuthenticated: false };
      }
    } catch (error) {
      // Log and handle different types of errors
      if (error.response) {
        // The request was made, but the server responded with a status code
        // outside the range of 2xx
        console.log('Error response:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.log('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Request setup error:', error.message);
      }
  
      // In case of any error, consider the user as not authenticated
      return { isAuthenticated: false };
    }
  };
  