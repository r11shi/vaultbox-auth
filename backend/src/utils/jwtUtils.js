const jwt = require('jsonwebtoken');
const config = require('../config');

const generateToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
  };
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiration });
};

const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

module.exports = {
  generateToken,
  verifyToken
};