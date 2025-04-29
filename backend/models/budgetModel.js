const mongoose = require('mongoose');

const budgetItemSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Food', 'Logistic', 'Transport', 'Other'],
    required: true,
  },
  item_name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unit_price: {
    type: Number,
    required: true,
    min: 0,
  },
  total_price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const budgetSchema = new mongoose.Schema(
  {
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    event_name: {
      type: String,
      required: true,
    },
    items: [budgetItemSchema],
    total_budget: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'hold'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Budget', budgetSchema);
