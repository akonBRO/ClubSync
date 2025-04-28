const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./database.js');
const studentRoutes = require('./routes/studentRoute.js');
const clubRoutes = require('./routes/clubRoutes');
const clubAuthRoutes = require('./routes/clubAuth');
const app = express();

connectDB();

app.use(cors({
  origin: 'http://localhost:3000', // Or your frontend's URL
  credentials: true, // Allow sending cookies across origins
}));
app.use(express.json());

// Configure session middleware
app.use(session({
  secret: 'key', // Replace with a strong, random secret
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/clubsync-db', // Use your MongoDB connection string
    collectionName: 'sessions', // Optional: Name of the session collection
    ttl: 24 * 60 * 60, // Session TTL in seconds (e.g., 24 hours)
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // Cookie expiry time (same as TTL) in milliseconds
    httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    sameSite: 'lax', // Help prevent CSRF attacks
    secure: false, // Only send over HTTPS in production
  },
}));

app.use('/api/students', studentRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/clubs', clubAuthRoutes);

console.log("Routes mounted: /api/students");

app.listen(3001, () => {
  console.log('🚀 Server running on http://localhost:3001');
});