const jwt = require("jsonwebtoken");
const response = require("../utils/responceHandler");
const User = require("../model/User");

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // ✅ Extract token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      console.log("No token found");
      return response(res, 401, "Authentication required. Please log in.");
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      console.log("Invalid or expired token");
      return response(res, 401, "Invalid or expired token. Please log in again.");
    }

    // ✅ Find user and exclude password
    const currentUser = await User.findById(decoded.id).select("-password");
    if (!currentUser) {
      console.log("User not found");
      return response(res, 401, "User not found. Please log in again.");
    }

    req.user = currentUser; // Attach user to request
    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    return response(res, 401, "Unauthorized access. Please log in again.");
  }
};

module.exports = authMiddleware;
