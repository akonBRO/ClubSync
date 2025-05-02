const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  uname: String,
  dob: String,
  umail: String,
  uid: Number,
  umobile: String,
  ugender: String,
  upassword: String,
  clubs: [String],
});

module.exports = mongoose.model('Student', studentSchema);
