const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');

// Get all drivers pending verification
router.get('/drivers/pending', async (req, res) => {
    try {
        const drivers = await Driver.find({ isVerified: false, isSuspended: false });
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all drivers
router.get('/drivers', async (req, res) => {
    try {
        const drivers = await Driver.find();
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Verify/Approve a driver
router.put('/drivers/:id/verify', async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        driver.isVerified = true;
        await driver.save();

        res.json({ message: 'Driver verified successfully', driver });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Reject a driver
router.put('/drivers/:id/reject', async (req, res) => {
    try {
        const { reason } = req.body;
        const driver = await Driver.findById(req.params.id);

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        driver.isSuspended = true;
        await driver.save();

        res.json({ message: 'Driver rejected', driver, reason });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all active trips (for safety monitoring)
router.get('/trips/active', async (req, res) => {
    try {
        const trips = await Trip.find({
            status: { $in: ['CONFIRMED', 'IN_PROGRESS'] }
        })
            .populate('user', 'name phone')
            .populate('driver', 'name phone vehicleNumber');

        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
