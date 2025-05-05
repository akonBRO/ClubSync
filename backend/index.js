const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./database.js');
const studentRoutes = require('./routes/studentRoute.js');
const clubRoutes = require('./routes/clubRoutes');

const clubAuthRoutes = require('./routes/clubAuth');
const studentAuthRoutes = require('./routes/studentAuth');
const recruitmentRoutes = require('./routes/recruitmentRoutes');
const eventRoutes = require('./routes/eventRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const studentEventRoutes = require('./routes/studentEvents');



connectDB();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend's URL
  credentials: true,
}));



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
app.use('/api/clubs', clubRoutes); 
app.use('/api/students', studentRoutes);
app.use('/api/students', studentAuthRoutes.router);    // Other club routes
app.use('/api/recruitment', recruitmentRoutes);

app.use('/api/events', eventRoutes);  
app.use('/api/budgets', budgetRoutes);
app.use('/api/student/events', studentEventRoutes);


console.log("Routes mounted:");
console.log(" - /api/clubs/auth, /api/clubs");
console.log(" - /api/students/auth, /api/students");
console.log(" - /api/recruitment");
console.log(" - /api/events");
console.log(" - /api/budgets");
console.log(" - /api/student/events");

app.get('/', (req, res) => {
  res.send('ClubSync API is running!');
});

app.listen(3001, () => {
  console.log('🚀 Server running on http://localhost:3001');
});
