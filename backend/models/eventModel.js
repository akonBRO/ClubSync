const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const eventSchema = new mongoose.Schema({
  booking_id: { type: String, default: () => uuidv4(), required: true, unique: true },
  club_name: String,
  event_name: String,
  event_date: Date,
  time_slots: [String],
  room_number: String,
  event_details: String,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Budget'], default: 'Pending' },
  std_reg: String,
  comments: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
