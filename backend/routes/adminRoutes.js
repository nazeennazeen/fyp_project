// routes/adminRoutes.js
// Handles admin authentication and admin-only booking management

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Booking = require('../models/Booking');
const requireAdmin = require('../middleware/auth');

// POST /api/admin/login — Authenticate an admin
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Compare the provided username against the environment variable
    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Compare the provided password against the bcrypt hash stored in .env
    const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Set the admin flag in the session
    req.session.isAdmin = true;

    res.json({ message: 'Login successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// POST /api/admin/logout — Clear the admin session
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out.' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully.' });
  });
});

// GET /api/admin/bookings — Get all bookings with tour details (admin only)
router.get('/bookings', requireAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('tourId', 'title location price')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching bookings.' });
  }
});

// PATCH /api/admin/bookings/:id — Update a booking's status (admin only)
router.patch('/bookings/:id', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    // Only allow valid status values
    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    res.json({ message: 'Booking status updated.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating booking.' });
  }
});

// GET /api/admin/check — Check if the current session is authenticated (used by frontend)
router.get('/check', (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.json({ isAdmin: true });
  }
  res.status(401).json({ isAdmin: false });
});

module.exports = router;
