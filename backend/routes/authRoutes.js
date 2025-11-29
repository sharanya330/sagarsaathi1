const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Driver = require('../models/Driver');

// Email configuration
let transporter = null;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  console.log('✓ Email service configured with user:', process.env.EMAIL_USER ? process.env.EMAIL_USER.substring(0, 3) + '***' : 'MISSING');
} else {
  console.log('⚠ Email credentials not found. EMAIL_USER:', !!process.env.EMAIL_USER, 'EMAIL_PASS:', !!process.env.EMAIL_PASS);
}

// OTP Store (in memory - in production use Redis)
const otpStore = {};

// Generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via Email or console
async function sendOTP(email, otp) {
  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'SagarSaathi Verification Code',
        text: `Your SagarSaathi verification code is: ${otp}. Valid for 5 minutes.`
      });
      console.log(`✓ Email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Email Error Details:', error);
      console.log(`⚠ Fallback: OTP for ${email} is ${otp}`);
      return false;
    }
  } else {
    // Mock mode - log to console
    console.log(`📧 MOCK OTP for ${email}: ${otp} (No Transporter)`);
    return false;
  }
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, role } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Generate OTP
  const otp = generateOTP();

  // Store OTP with 5-minute expiry
  otpStore[email] = {
    otp: otp,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
  };

  // Send OTP
  await sendOTP(email, otp);

  res.json({
    message: "OTP sent successfully",
    emailEnabled: !!transporter
  });
});

// POST /api/auth/verify
router.post('/verify', async (req, res) => {
  const { email, otp, role } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  // Check if OTP exists and is valid
  const storedOTP = otpStore[email];

  if (!storedOTP) {
    return res.status(400).json({ message: "OTP not found. Please request a new one." });
  }

  if (Date.now() > storedOTP.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP expired. Please request a new one." });
  }

  console.log(`Debug: Verifying OTP for ${email}. Stored: '${storedOTP.otp}', Received: '${otp}'`);

  if (String(storedOTP.otp).trim() !== String(otp).trim()) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // OTP is valid - delete it
  delete otpStore[email];

  try {
    let user;
    if (role === 'driver') {
      user = await Driver.findOne({ email });
      if (!user) {
        // Create new driver with provided details
        user = await Driver.create({
          email,
          phone: req.body.phone || '', // Phone is collected in registration form
          name: req.body.name || 'New Driver',
          vehicleType: req.body.vehicleType || 'OTHER',
          vehicleNumber: req.body.vehicleNumber,
          cityBase: req.body.cityBase,
          // Initialize empty docs structure
          docs: {
            licenseUrl: '',
            rcUrl: '',
            insuranceUrl: '',
            permitUrl: '',
            selfieUrl: ''
          }
        });
      }
    } else {
      user = await User.findOne({ email });
      if (!user) {
        // Create new user with provided details
        user = await User.create({
          email,
          phone: req.body.phone || '', // Phone is collected in registration form
          name: req.body.name || 'New User',
          emergencyContact: req.body.emergencyContact || {}
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
