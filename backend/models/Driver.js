// backend/models/Driver.js
const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    name: { type: String },
    vehicleType: {
      type: String,
      enum: ["SUPRO", "INNOVA", "SUV", "TEMPO_TRAVELLER", "OTHER"],
      required: true,
    },
    vehicleNumber: { type: String },
    cityBase: { type: String }, // e.g. "Hyderabad"

    // KYC docs (just URLs in MVP)
    docs: {
      licenseUrl: String,
      rcUrl: String,
      insuranceUrl: String,
      permitUrl: String,
      selfieUrl: String,
    },

    isVerified: { type: Boolean, default: false }, // set true after admin vetting

    strikeCount: { type: Number, default: 0 }, // cancellation strikes
    isSuspended: { type: Boolean, default: false },

    // For availability – we block overlapping dates
    scheduledTrips: [
      {
        tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
        startDate: Date,
        endDate: Date,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
