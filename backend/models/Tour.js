// models/Tour.js
// Mongoose schema for tourist tours stored in the "tours" collection

const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tour title is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
      // e.g. "5 Days / 4 Nights"
    },
    availableSeats: {
      type: Number,
      required: [true, 'Available seats is required'],
      min: [0, 'Available seats cannot be negative'],
    },
    // URL to the image stored on Backblaze B2
    imageUrl: {
      type: String,
      default: '',
    },
    // The object key (path) used to store/delete the file in Backblaze B2
    imageKey: {
      type: String,
      default: '',
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

module.exports = mongoose.model('Tour', tourSchema);
