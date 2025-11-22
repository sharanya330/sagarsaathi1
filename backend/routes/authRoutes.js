const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Driver = require('../models/Driver');

// Twilio configuration (optional)
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_PHONE_NUMBER &&
  process.env.TWILIO_ACCOUNT_SID !== 'your_account_sid_here') {
  try {
    const twilio = require('twilio');
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log('✓ Twilio SMS enabled');
  } catch (error) {
    console.log('⚠ Twilio not configured, using mock OTP');
  }
} else {
  console.log('⚠ Twilio credentials not found, using mock OTP');
}

// OTP Store (in memory - in production use Redis)
const otpStore = {};

// Generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via SMS or console
async function sendOTP(phone, otp) {
  if (twilioClient) {
    try {
      await twilioClient.messages.create({
        body: `Your SagarSaathi OTP is: ${otp}. Valid for 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      });
      console.log(`✓ SMS sent to ${phone}`);
      return true;
    } catch (error) {
      console.error('SMS Error:', error.message);
      console.log(`⚠ Fallback: OTP for ${phone} is ${otp}`);
      return false;
    }
  } else {
    // Mock mode - log to console
    console.log(`📱 MOCK OTP for ${phone}: ${otp}`);
    return false;
  }
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { phone, role } = req.body;

  // Generate OTP
  const otp = generateOTP();

  // Store OTP with 5-minute expiry
  otpStore[phone] = {
    otp: otp,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
  };

  // Send OTP
  const smsSent = await sendOTP(phone, otp);

  res.json({
    message: "OTP sent successfully",
    smsEnabled: !!twilioClient,
    // In development, include OTP in response (remove in production)
    ...(process.env.NODE_ENV !== 'production' && { devOTP: otp })
  });
});

// POST /api/auth/verify
router.post('/verify', async (req, res) => {
  const { phone, otp, role } = req.body;

  // Check if OTP exists and is valid
  const storedOTP = otpStore[phone];

  if (!storedOTP) {
    return res.status(400).json({ message: "OTP not found. Please request a new one." });
  }

  if (Date.now() > storedOTP.expiresAt) {
    delete otpStore[phone];
    return res.status(400).json({ message: "OTP expired. Please request a new one." });
  }

  if (storedOTP.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // OTP is valid - delete it
  delete otpStore[phone];

  try {
    let user;
    if (role === 'driver') {
      user = await Driver.findOne({ phone });
      if (!user) {
        user = await Driver.create({
          phone,
          vehicleType: 'OTHER',
          name: 'New Driver'
        });
      }
    } else {
      user = await User.findOne({ phone });
      if (!user) {
        user = await User.create({
          phone,
          name: 'New User'
        });
      }
    }

    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({ token, user });
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(500).json({ message: "Server error during verification" });
  }
});

module.exports = router;
