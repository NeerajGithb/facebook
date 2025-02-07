const express = require('express');
const { registerUser, loginUser, logout } = require('../controllers/authController');
const passport = require('passport');
const router = express.Router();

const jwt = require("jsonwebtoken");

// User registration and login routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logout);

// Function to sign the token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Google OAuth route for authentication
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Callback route for Google OAuth
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: `${process.env.FRONTEND_URL}/user-login`, session: false
}), (req, res) => {
  if (req.user) {

    const token = signToken(req?.user?._id);
    req.user.password = undefined; // Hide password from response
    return res.redirect(`${process.env.FRONTEND_URL}/?token=${token}`);
  } else {
    // Handle failure by returning error in response body
    return res.status(400).json({
      status: 'error',
      message: 'Google login failed, please try again.',
    });
  }
});

module.exports = router;
