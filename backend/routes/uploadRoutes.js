// routes/uploadRoutes.js
// Handles image uploads to Backblaze B2 (admin only)

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const b2Client = require('../config/backblaze');
const requireAdmin = require('../middleware/auth');

// Configure multer to store uploaded files in memory (not on disk)
// Max file size: 5 MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    // Only allow image files
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, and WebP images are allowed.'));
    }
  },
});

// POST /api/upload — Upload a tour image to Backblaze B2 (admin only)
router.post('/', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided.' });
    }

    // Check if Backblaze credentials are configured
    if (!process.env.B2_KEY_ID || !process.env.B2_APPLICATION_KEY || !process.env.B2_BUCKET_NAME) {
      return res.status(503).json({
        message: 'Backblaze B2 is not configured. Please set the B2_* environment variables in your .env file.',
      });
    }

    // Generate a unique key so filenames never clash
    const ext = path.extname(req.file.originalname).toLowerCase();
    const uniqueKey = `tours/${uuidv4()}${ext}`;

    // Upload the file to Backblaze B2
    const command = new PutObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: uniqueKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    await b2Client.send(command);

    // Build the public URL for the uploaded image
    // This assumes the B2 bucket is set to "Public" access
    const imageUrl = `${process.env.B2_ENDPOINT}/${process.env.B2_BUCKET_NAME}/${uniqueKey}`;

    res.status(201).json({
      message: 'Image uploaded successfully.',
      imageUrl,
      imageKey: uniqueKey,
    });
  } catch (error) {
    console.error('Upload error:', error);

    // Provide a clear message for multer size limit errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size exceeds the 5 MB limit.' });
    }

    res.status(500).json({ message: error.message || 'Server error uploading image.' });
  }
});

module.exports = router;
