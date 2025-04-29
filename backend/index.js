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
  credentials: true,
}));
app.use(express.json());

app.use(session({
  secret: 'key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/clubsync-db',
    collectionName: 'sessions',
    ttl: 24 * 60 * 60,
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax', // changed
    secure: false,
    domain: 'localhost'
  },
}));

// Correct order
app.use('/api/clubs', clubAuthRoutes); // Login and dashboard
app.use('/api/clubs', clubRoutes);     // Other club routes
app.use('/api/students', studentRoutes);

console.log("Routes mounted: /api/students");

app.listen(3001, () => {
  console.log('🚀 Server running on http://localhost:3001');
});
