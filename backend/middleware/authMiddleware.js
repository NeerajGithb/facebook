const jwt = require("jsonwebtoken");
const response = require("../utils/responceHandler");
const User = require("../model/User");
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log("No token found");
      return response(res, 401, "Authentication required. Please provide a token.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    if (!decoded) {
      console.log("Invalid or expired token");
      return response(res, 401, "Invalid token or expired. Please log in again.");
    }

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      console.log("User not found");
      return response(res, 401, "The user belonging to this token no longer exists.");
    }

    req.user = currentUser;
    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    return response(res, 401, "Invalid token or expired. Please log in again.");
  }
};

module.exports = authMiddleware;
