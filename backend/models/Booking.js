// models/Booking.js
// Mongoose schema for customer bookings stored in the "bookings" collection

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    // Reference to the Tour that was booked
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Tour reference is required'],
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    numberOfPeople: {
      type: Number,
      required: [true, 'Number of people is required'],
      min: [1, 'At least 1 person is required'],
    },
    bookingDate: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    // Unique reference code sent to the customer for looking up their booking
    bookingReference: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
