// routes/tourRoutes.js
// Handles all tour-related API endpoints

const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');
const requireAdmin = require('../middleware/auth');

// GET /api/tours — Retrieve all tours (public)
// Optional query: ?search=keyword to filter by name or location
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    // Build a case-insensitive search filter if a search term is provided
    if (search && search.trim() !== '') {
      filter = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const tours = await Tour.find(filter).sort({ createdAt: -1 });
    res.json(tours);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching tours.' });
  }
});

// GET /api/tours/:id — Retrieve a single tour by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found.' });
    }
    res.json(tour);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching tour.' });
  }
});

// POST /api/tours — Create a new tour (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { title, location, description, price, duration, availableSeats, imageUrl, imageKey } = req.body;

    const tour = new Tour({ title, location, description, price, duration, availableSeats, imageUrl, imageKey });
    await tour.save();

    res.status(201).json({ message: 'Tour created successfully.', tour });
  } catch (error) {
    // Return validation errors in a readable format
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error creating tour.' });
  }
});

// PUT /api/tours/:id — Update a tour (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { title, location, description, price, duration, availableSeats, imageUrl, imageKey } = req.body;

    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      { title, location, description, price, duration, availableSeats, imageUrl, imageKey },
      { new: true, runValidators: true } // Return updated document and run schema validators
    );

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found.' });
    }

    res.json({ message: 'Tour updated successfully.', tour });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error updating tour.' });
  }
});

// DELETE /api/tours/:id — Delete a tour (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found.' });
    }
    res.json({ message: 'Tour deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting tour.' });
  }
});

module.exports = router;
