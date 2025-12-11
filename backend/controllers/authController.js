// backend/controllers/authController.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Driver = require("../models/Driver");

// In-memory store for OTPs for MVP/demo
const otpStore = new Map();

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

exports.requestOtp = async (req, res) => {
  try {
    const { phone, role } = req.body; // role: "USER" or "DRIVER"
    if (!phone || !role) {
      return res.status(400).json({ message: "Phone and role are required" });
    }

    const otp = generateOtp();
    otpStore.set(phone, otp);

    // TODO: integrate with Exotel/Twilio to actually send OTP
    console.log(`DEBUG OTP for ${phone}: ${otp}`);

    return res.json({ message: "OTP sent (demo mode)" });
  } catch (err) {
    console.error("requestOtp error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phone, role, otp } = req.body;

    const storedOtp = otpStore.get(phone);
    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    otpStore.delete(phone);

    let model = role === "DRIVER" ? Driver : User;
    let user = await model.findOne({ phone });

    if (!user) {
      user = await model.create({ phone });
    }

    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET || "sagarsaathi_secret",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      role,
      user: { id: user._id, phone: user.phone },
    });
  } catch (err) {
    console.error("verifyOtp error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
