const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwtUtils');
const otpUtils = require('../utils/otpUtils');
const emailService = require('./emailService');

const saltRounds = 10;

const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

// Mock user data (replace with database later)
const users = [
  {
    id: '1',
    email: 'therushidesign@gmail.com',
    password: '', // We'll set this after hashing
  }
];

// Immediately invoke this function to set the hashed password
(async () => {
  users[0].password = await hashPassword('password123');
})();

const otpStore = new Map();

const authenticateUser = async (email, password) => {
  const user = users.find(u => u.email === email);
  if (!user) {
    throw new Error('Authentication failed');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Authentication failed');
  }

  const otp = otpUtils.generateOTP();
  console.log(`Generated OTP for user ${user.id}: ${otp}`);
  otpStore.set(user.id, { otp, createdAt: Date.now() });
  console.log('Stored OTP:', otpStore.get(user.id));

  await emailService.sendOTPEmail(user.email, otp);

  return { userId: user.id };
};

const verifyOTP = async (userId, otp) => {
  console.log(`Verifying OTP for user ${userId}: ${otp}`);
  console.log('Current OTP store:', otpStore);
  const storedOTP = otpStore.get(userId);
  console.log(`Stored OTP for user ${userId}:`, storedOTP);

  if (!storedOTP) {
    console.log(`No OTP found for user ${userId}`);
    throw new Error('Invalid OTP or OTP expired');
  }

  if (storedOTP.otp !== otp) {
    console.log(`OTP mismatch for user ${userId}. Received: ${otp}, Stored: ${storedOTP.otp}`);
    throw new Error('Invalid OTP');
  }

  if (Date.now() - storedOTP.createdAt > 5 * 60 * 1000) {
    console.log(`OTP expired for user ${userId}`);
    throw new Error('OTP expired');
  }

  console.log(`OTP verified successfully for user ${userId}`);
  otpStore.delete(userId);
  console.log('Updated OTP store after verification:', otpStore);

  const user = users.find(u => u.id === userId);
  const token = jwtUtils.generateToken(user);

  return { token };
};

module.exports = {
  authenticateUser,
  verifyOTP,
  hashPassword
};