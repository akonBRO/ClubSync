const connectDB = require('./database.js');
const userModel = require('./models/user.js');
const express = require('express');
const mongoose = require('mongoose');
connectDB()
const app = express();

app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});

