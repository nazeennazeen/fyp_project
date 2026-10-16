// server.js
// Main Express server — entry point of the application

require('dotenv').config(); // Load environment variables from .env FIRST

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const connectDB = require('./config/database');

// Import route handlers
const tourRoutes = require('./routes/tourRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Connect to MongoDB ---
connectDB();

// --- Middleware ---

// CORS middleware allowing frontend at http://localhost:3000
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form bodies (for HTML forms)
app.use(express.urlencoded({ extended: true }));

// Session management — stores sessions in MongoDB so they survive server restarts
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback-dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 60 * 60 * 24, // Sessions expire after 24 hours
    }),
    cookie: {
      httpOnly: true,  // Prevent JavaScript from accessing the cookie
      maxAge: 1000 * 60 * 60 * 24, // 24 hours in milliseconds
      secure: false,   // Set to true if using HTTPS in production
    },
  })
);

// Serve static frontend files from the /frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// --- API Routes ---
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// --- Catch-all: serve index.html for any unknown route ---
// This ensures the frontend handles navigation for any page reload
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// --- Start the server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
