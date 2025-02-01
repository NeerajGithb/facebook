const jwt = require("jsonwebtoken");
const response = require("../utils/responceHandler");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d", // Default to 7 days
  });
};

const createSendToken = (user, statusCode, res, message) => {
  try {
    const token = signToken(user._id);
    user.password = undefined; // Remove password from response

    return response(res, statusCode, message, {
      token, // ✅ No cookie, return token directly
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in createSendToken:", error);
    return response(res, 500, "Token generation failed", { error: error.message });
  }
};

module.exports = createSendToken;
