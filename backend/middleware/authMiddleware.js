const jwt = require('jsonwebtoken');
const response = require('../utils/responceHandler');


const authMiddleware = (req, res, next) => {
    // Retrieve token from cookies
    const authToken = req?.cookies?.auth_token;
  
    // If no token is provided, respond with 401 Unauthorized
    if (!authToken) {
      return response(res, 401, 'Authentication required. Please provide a token');
    }
  
    try {
      // Verify the JWT token
      const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
  
      // Attach the decoded token data (user info) to the request object
      req.user = decoded;
  
      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      // Log the error for debugging purposes
      console.error(error);
  
      // Respond with a 401 Unauthorized status if the token is invalid or expired
      return response(res, 401, 'Invalid token or expired. Please log in again.');
    }
  }
  
  module.exports = authMiddleware;