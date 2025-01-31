const jwt = require("jsonwebtoken");
const response = require("../utils/responceHandler");
const User = require("../model/User");

const authMiddleware = async (req, res, next) => {
  try {
    // Retrieve token from cookies or Authorization header (handling missing header safely)
    const token = req.cookies.jwt || req.headers.authorization.split(" ")[1];

    // If no token is provided, respond with 401 Unauthorized
    if (!token) {
      return response(res, 401, "Authentication required. Please provide a token.");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return response(res, 401, "Invalid token or expired. Please log in again.");
    }

    // Check if user exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return response(res, 401, "The user belonging to this token no longer exists.");
    }

    // Attach user to request
    req.user = currentUser;
    next();
  } catch (error) {
    return response(res, 401, "Invalid token or expired. Please log in again.");
  }
};

module.exports = authMiddleware;
