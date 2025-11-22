const express = require('express');
const router = express.Router();
const multer = require('multer');
const Driver = require('../models/Driver');

// Configure multer for file uploads (in-memory storage for now)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only images and PDFs are allowed'));
        }
    }
});

// Upload driver documents
router.post('/documents', upload.fields([
    { name: 'license', maxCount: 1 },
    { name: 'rc', maxCount: 1 },
    { name: 'insurance', maxCount: 1 },
    { name: 'permit', maxCount: 1 },
    { name: 'selfie', maxCount: 1 }
]), async (req, res) => {
    try {
        const { driverId } = req.body;

        if (!driverId) {
            return res.status(400).json({ message: 'Driver ID is required' });
        }

        const driver = await Driver.findById(driverId);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Mock URLs (in production, upload to Cloudinary/S3 and get real URLs)
        const docs = {};
        if (req.files.license) docs.licenseUrl = `mock://license_${Date.now()}.jpg`;
        if (req.files.rc) docs.rcUrl = `mock://rc_${Date.now()}.jpg`;
        if (req.files.insurance) docs.insuranceUrl = `mock://insurance_${Date.now()}.jpg`;
        if (req.files.permit) docs.permitUrl = `mock://permit_${Date.now()}.jpg`;
        if (req.files.selfie) docs.selfieUrl = `mock://selfie_${Date.now()}.jpg`;

        driver.docs = { ...driver.docs, ...docs };
        await driver.save();

        res.json({
            message: 'Documents uploaded successfully',
            docs: driver.docs
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get driver profile
router.get('/:id', async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.json(driver);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update driver profile
router.put('/:id', async (req, res) => {
    try {
        const driver = await Driver.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.json(driver);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
