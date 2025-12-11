// backend/models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },

    amount: { type: Number, required: true }, // lead fee
    currency: { type: String, default: "INR" },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },

    gateway: { type: String, default: "RAZORPAY" },
    gatewayOrderId: String,
    gatewayPaymentId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
