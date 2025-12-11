// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    name: { type: String },
    emergencyContact: {
      name: String,
      phone: String,
    },
    activeTrip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
