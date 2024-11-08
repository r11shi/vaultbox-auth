const jwt = require('jsonwebtoken');
const authService = require('../services/authService');
const config = require('../config');

function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      publicKey: user.publicKey,
      role: user.role,
      status: "online",
      lastSeen: new Date().toISOString()
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.authenticateUser(email, password);
    res.json({ userId: user.userId });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    console.log(`Received OTP verification request for user ${userId} with OTP ${otp}`);
    const result = await authService.verifyOTP(userId, otp);
    res.json(result);
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(400).json({ message: error.message });
  }
};

const verifyPasskey = async (req, res) => {
  try {
    const { passkey } = req.body;
    console.log("Received passkey:", passkey);
    if (passkey === '7777') {
      console.log("Passkey verified successfully");
      const token = jwt.sign({ userId: 'dummyUserId' }, config.jwtSecret, { expiresIn: config.jwtExpiration });
      res.json({ token });
    } else {
      console.error("Invalid passkey attempt:", passkey);
      res.status(401).json({ message: 'Invalid passkey' });
    }
  } catch (error) {
    console.error("Server error during passkey verification:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  login,
  verifyOTP,
  verifyPasskey
};