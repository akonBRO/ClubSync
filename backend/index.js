const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./database.js');
const studentRoutes = require('./routes/studentRoute.js');
const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use('/api/students', studentRoutes);



console.log("Routes mounted: /api/students");


app.listen(3001, () => {
  console.log('🚀 Server running on http://localhost:3001');
});

