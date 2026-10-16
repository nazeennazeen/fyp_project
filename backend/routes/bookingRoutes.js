// routes/bookingRoutes.js
// Handles booking creation and customer self-service booking lookup

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');

// POST /api/bookings — Create a new booking
router.post('/', async (req, res) => {
  try {
    const { tourId, fullName, email, phone, numberOfPeople, bookingDate } = req.body;

    // --- Server-side validation ---
    if (!tourId || !fullName || !email || !phone || !numberOfPeople || !bookingDate) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const people = parseInt(numberOfPeople, 10);
    if (isNaN(people) || people < 1) {
      return res.status(400).json({ message: 'Number of people must be at least 1.' });
    }

    // Validate booking date is not in the past
    const date = new Date(bookingDate);
    if (isNaN(date.getTime()) || date < new Date()) {
      return res.status(400).json({ message: 'Please select a valid future booking date.' });
    }

    // --- Atomically decrement seats if available ---
    const tour = await Tour.findOneAndUpdate(
      { _id: tourId, availableSeats: { $gte: people } },
      { $inc: { availableSeats: -people } },
      { new: true }
    );

    if (!tour) {
      // Check if tour exists but not enough seats
      const existingTour = await Tour.findById(tourId);
      if (!existingTour) {
        return res.status(404).json({ message: 'Tour not found.' });
      }
      return res.status(400).json({
        message: `Only ${existingTour.availableSeats} seat(s) available for this tour.`,
      });
    }

    // --- Create the booking record ---
    const bookingReference = uuidv4().split('-')[0].toUpperCase(); // Short unique reference, e.g. "A1B2C3D4"
    const totalPrice = tour.price * people;

    const booking = new Booking({
      tourId,
      fullName,
      email,
      phone,
      numberOfPeople: people,
      bookingDate: date,
      totalPrice,
      status: 'pending',
      bookingReference,
    });

    await booking.save();

    res.status(201).json({
      message: 'Booking confirmed!',
      bookingReference,
      totalPrice,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Server error creating booking.' });
  }
});

// POST /api/bookings/lookup — Find a booking by email + booking reference (public self-service)
router.post('/lookup', async (req, res) => {
  try {
    const { email, bookingReference } = req.body;

    if (!email || !bookingReference) {
      return res.status(400).json({ message: 'Email and booking reference are required.' });
    }

    // Find booking and populate tour details
    const booking = await Booking.findOne({
      email: email.toLowerCase().trim(),
      bookingReference: bookingReference.trim().toUpperCase(),
    }).populate('tourId', 'title location imageUrl');

    if (!booking) {
      return res.status(404).json({ message: 'No booking found with those details.' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error looking up booking.' });
  }
});

module.exports = router;
