const User = require("../model/User");
const response = require("../utils/responceHandler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);

  user.password = undefined; // Hide password from response

  return response(res, statusCode, message, {
    token, // Send token in response body
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password, gender, dateOfBirth } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response(res, 400, "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      gender,
      dateOfBirth,
    });

    return createSendToken(newUser, 201, res, "Registration successful");
  } catch (error) {
    console.error("Register Error:", error);
    return response(res, 500, "Internal Server Error", error.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return response(res, 404, "User not found with this email");
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return response(res, 401, "Invalid Password");
    }

    return createSendToken(user, 200, res, "Login successful");
  } catch (error) {
    console.error("Login Error:", error);
    return response(res, 500, "Internal Server Error", error.message);
  }
};

const logout = (req, res) => {
  try {
    return response(res, 200, "Logged out successfully");
  } catch (error) {
    console.error("Logout Error:", error);
    return response(res, 500, "Internal Server Error", error.message);
  }
};

module.exports = { registerUser, loginUser, logout };
