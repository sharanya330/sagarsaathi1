// backend/models/Trip.js
const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },

    origin: {
      address: String,
      lat: Number,
      lng: Number,
    },
    stops: [
      {
        address: String,
        lat: Number,
        lng: Number,
        order: Number,
      },
    ],

    groupSize: { type: Number, required: true },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    status: {
      type: String,
      enum: ["PENDING", "OFFERED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },

    // safety + tracking
    lastKnownLocation: {
      lat: Number,
      lng: Number,
      updatedAt: Date,
    },
    sosTriggered: { type: Boolean, default: false },
    sosHistory: [
      {
        triggeredAt: Date,
        lat: Number,
        lng: Number,
        handledBy: String, // admin name or id
      },
    ],

    // basic rating after trip
    ratingByUser: { type: Number, min: 1, max: 5 },

    // lead-fee payment flag
    leadFeePaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
