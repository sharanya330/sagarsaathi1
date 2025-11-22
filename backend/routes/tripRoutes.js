const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');

// Create a trip
router.post('/', async (req, res) => {
  try {
    // Ensure dates are parsed correctly if sent as strings
    const tripData = {
      ...req.body,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate)
    };

    const trip = await Trip.create(tripData);
    res.status(201).json(trip);
  } catch (error) {
    console.error("Create Trip Error:", error);
    res.status(400).json({ message: error.message });
  }
});

// Get all pending trips (for drivers)
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find({ status: 'PENDING' }).populate('user', 'name phone');
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get trips for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accept a trip (driver)
router.put('/:id/accept', async (req, res) => {
  try {
    const { driverId } = req.body;
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.status !== 'PENDING') {
      return res.status(400).json({ message: 'Trip is not available' });
    }

    // Update trip
    trip.driver = driverId;
    trip.status = 'CONFIRMED';
    await trip.save();

    res.json({ message: 'Trip accepted successfully', trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel a trip
router.put('/:id/cancel', async (req, res) => {
  try {
    const { reason } = req.body;
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    trip.status = 'CANCELLED';
    await trip.save();

    res.json({ message: 'Trip cancelled successfully', trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
