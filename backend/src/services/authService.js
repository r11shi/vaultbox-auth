const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwtUtils');
const otpUtils = require('../utils/otpUtils');
const emailService = require('./emailService');

const saltRounds = 10;

// Hash password once when the application starts for consistent test data
const hashPassword = async (password) => await bcrypt.hash(password, saltRounds);

// Mock user data (replace with a database later)
const users = [
  {
    id: '1',
    email: 'yourmail@gmail.com',
    password: '', // set this after hashing
  }
];

// Immediately hash the test password
(async () => {
  users[0].password = await hashPassword('password123');
})();

const otpStore = new Map();

// Authenticate user and generate OTP
const authenticateUser = async (email, password) => {
  const user = users.find(u => u.email === email);
  if (!user) throw new Error('Authentication failed');

  // Validate password synchronously for a minor speed boost
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) throw new Error('Authentication failed');

  // Generate and store OTP immediately
  const otp = otpUtils.generateOTP();
  otpStore.set(user.id, { otp, createdAt: Date.now() });

  // Send OTP email in the background without blocking the response
  emailService.sendOTPEmail(user.email, otp)
    .then(() => console.log('OTP email sent'))
    .catch(err => console.error('Error sending OTP email:', err));

  // Return user ID immediately for faster front-end transition
  return { userId: user.id };
};

// Verify OTP with expiry check
const verifyOTP = async (userId, otp) => {
  const storedOTP = otpStore.get(userId);
  if (!storedOTP) throw new Error('Invalid OTP or OTP expired');

  // Check if OTP matches and is within 5 minutes
  if (storedOTP.otp !== otp || Date.now() - storedOTP.createdAt > 5 * 60 * 1000) {
    otpStore.delete(userId); // Clean up expired OTP
    throw new Error('Invalid or expired OTP');
  }

  // OTP verified successfully; issue a token and clear OTP
  otpStore.delete(userId);
  const user = users.find(u => u.id === userId);
  const token = jwtUtils.generateToken(user);
  
  return { token };
};

module.exports = {
  authenticateUser,
  verifyOTP,
  hashPassword
};
