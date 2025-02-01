const jwt = require("jsonwebtoken");
const response = require("../utils/responceHandler");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,  // Ensures cookie is only sent over HTTPS
    sameSite: "None",  // Required for cross-site authentication
  };

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined; // Prevent sending password in response

  return response(res, statusCode, message, {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

module.exports = createSendToken;
