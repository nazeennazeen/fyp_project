// seed.js
// Run this script once to populate the database with sample tour data
// Usage: node seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const Tour = require('./models/Tour');

// Sample tour data — uses publicly available placeholder images
// Replace imageUrl values with your own Backblaze B2 URLs after uploading real images
const sampleTours = [
  {
    title: 'Santorini Greek Island Escape',
    location: 'Santorini, Greece',
    description:
      'Experience the breathtaking beauty of Santorini with its iconic white-washed buildings, crystal-blue domes, and stunning caldera views. Enjoy sunset cruises, wine tasting, and exploring the charming village of Oia.',
    price: 1299,
    duration: '7 Days / 6 Nights',
    availableSeats: 20,
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    imageKey: '',
  },
  {
    title: 'Safari Adventure in Kenya',
    location: 'Maasai Mara, Kenya',
    description:
      'Witness the spectacular Great Migration and encounter Africa\'s Big Five on this unforgettable safari. Stay in luxury tented camps, enjoy guided game drives at dawn, and immerse yourself in Maasai culture.',
    price: 2499,
    duration: '10 Days / 9 Nights',
    availableSeats: 12,
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
    imageKey: '',
  },
  {
    title: 'Bali Cultural & Beach Retreat',
    location: 'Bali, Indonesia',
    description:
      'Discover the magic of Bali through its ancient temples, terraced rice paddies, and pristine beaches. This tour includes cooking classes, traditional dance performances, and relaxing spa treatments.',
    price: 899,
    duration: '8 Days / 7 Nights',
    availableSeats: 25,
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    imageKey: '',
  },
  {
    title: 'Tokyo & Kyoto Cultural Journey',
    location: 'Tokyo & Kyoto, Japan',
    description:
      'Explore the perfect blend of ultramodern Tokyo and traditional Kyoto. Visit ancient shrines, experience a tea ceremony, stroll through bamboo forests, and taste authentic Japanese cuisine.',
    price: 1799,
    duration: '12 Days / 11 Nights',
    availableSeats: 15,
    imageUrl: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=800&q=80',
    imageKey: '',
  },
  {
    title: 'Machu Picchu & Inca Trail Trek',
    location: 'Cusco & Machu Picchu, Peru',
    description:
      'Trek the legendary Inca Trail through cloud forests and mountain passes to reach the iconic citadel of Machu Picchu. Explore the Sacred Valley, visit Inca ruins, and experience the rich Quechua culture.',
    price: 1599,
    duration: '9 Days / 8 Nights',
    availableSeats: 16,
    imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80',
    imageKey: '',
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing tours to start fresh
    await Tour.deleteMany({});
    console.log('🗑️  Cleared existing tours');

    // Insert sample tours
    const createdTours = await Tour.insertMany(sampleTours);
    console.log(`🌱 Inserted ${createdTours.length} sample tours successfully!`);

    // Print inserted tour titles for confirmation
    createdTours.forEach((tour) => {
      console.log(`   • ${tour.title} (${tour.location}) — $${tour.price}/person`);
    });
  } catch (error) {
    console.error('❌ Seed error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

seedDatabase();
