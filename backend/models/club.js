const mongoose = require('mongoose');


const clubSchema = new mongoose.Schema({
  cname: String,
  caname: String,
  cpname: String,
  cmail: String,
  cid: Number,
  cmobile: Number,
  cpassword: String
});

module.exports = mongoose.model('Club', clubSchema);
