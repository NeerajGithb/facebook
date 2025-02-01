const express = require('express');
const { registerUser, loginUser, logout } = require('../controllers/authController');
const passport = require('passport');
const createSendToken = require('../utils/createSendToken'); // Importing createSendToken
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logout);

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google callback route
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: `${process.env.FRONTEND_URL}/user-login`, session: false
}), (req, res) => {
  // Use createSendToken to generate and send the JWT token after successful Google authentication
  createSendToken(req.user, 200, res, "Google login successful");

  // Send the response with the redirect URL and token
  res.json({
    message: "Google login successful",
    token: res.token,  // The token generated in createSendToken will be available here
    redirectUrl: `${process.env.FRONTEND_URL}`
  });
});

module.exports = router;;
