const mongoose = require('mongoose');

const userSchema= new mongoose.Schema({
    name:String,
    age:Number
})
const userModel= mongoose.model("emp", userSchema);

const adminSchema = new mongoose.Schema({
    username: String,
    password: String
  });
  const adminModel = mongoose.model("admin", adminSchema);
  
  // Export both models
  module.exports = {
    userModel,
    adminModel
  };