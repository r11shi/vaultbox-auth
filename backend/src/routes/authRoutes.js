const express = require('express');
const authController = require('../controllers/authController');
const emailService = require('../services/emailService');

const router = express.Router();

router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOTP);

// Add this new route for testing
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    await emailService.sendOTPEmail(email, '123456');
    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending test email', error: error.message });
  }
});

// Add this new route for passkey verification
router.post('/verify-passkey', authController.verifyPasskey);

module.exports = router;