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
      // Retrieve the token from localStorage or wherever it is stored
      const token = localStorage.getItem('authToken'); // Assuming your token is in localStorage
  
      // Ensure the token exists
      if (!token) {
        return { isAuthenticated: false, message: 'No token found.' };
      }
  
      // Make the request with the Authorization header
      const response = await axiosInstance.get('users/check-auth', {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token here
        },
      });
  
      // Check for successful response
      if (response.data.status === 'success') {
        return { isAuthenticated: true, user: response.data.data };
      } else {
        return { isAuthenticated: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Error in checkUserAuth:', error);
      return { isAuthenticated: false, message: error.message };
    }
  };
  