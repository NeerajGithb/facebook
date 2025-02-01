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
  if (req.user) {
    // If the user is authenticated, create the token and send it in response
    createSendToken(req.user, 200, res, "Google login successful");
  } else {
    // Redirect to login page on failure
    res.redirect(`${process.env.FRONTEND_URL}/user-login`);
  }
});

module.exports = router;
