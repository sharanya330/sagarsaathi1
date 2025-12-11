// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const adminRoutes = require("./routes/adminRoutes");
const driverRoutes = require("./routes/driverRoutes");
//const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// connect to MongoDB
connectDB();

// CORS configuration for production
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3002",
  process.env.FRONTEND_URL, // Add your Vercel URL here
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(allowed => origin?.includes(allowed))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/drivers", driverRoutes);
// app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.send("SagarSaathi API is running");
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Socket.io setup for real-time GPS tracking
const io = require("socket.io")(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store active connections
const activeTrips = new Map();

io.on("connection", (socket) => {
  console.log(`✓ Client connected: ${socket.id}`);

  // Driver joins a trip room
  socket.on("join-trip", (tripId) => {
    socket.join(`trip-${tripId}`);
    console.log(`Driver joined trip: ${tripId}`);
  });

  // Driver sends location update
  socket.on("location-update", async (data) => {
    const { tripId, location } = data;

    // Broadcast to all clients watching this trip
    io.to(`trip-${tripId}`).emit("location-updated", {
      tripId,
      location,
      timestamp: new Date()
    });

    // Update trip in database
    try {
      const Trip = require("./models/Trip");
      await Trip.findByIdAndUpdate(tripId, {
        lastKnownLocation: {
          lat: location.lat,
          lng: location.lng,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error("Error updating location:", error);
    }
  });

  // SOS alert
  socket.on("trigger-sos", async (data) => {
    const { tripId, location } = data;

    // Broadcast SOS to all admins
    io.emit("sos-alert", {
      tripId,
      location,
      timestamp: new Date()
    });

    // Update trip in database
    try {
      const Trip = require("./models/Trip");
      await Trip.findByIdAndUpdate(tripId, {
        sosTriggered: true,
        $push: {
          sosHistory: {
            triggeredAt: new Date(),
            lat: location.lat,
            lng: location.lng
          }
        }
      });
    } catch (error) {
      console.error("Error triggering SOS:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`✗ Client disconnected: ${socket.id}`);
  });
});
