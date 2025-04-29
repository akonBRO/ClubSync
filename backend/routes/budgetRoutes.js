const express = require('express');
const router = express.Router();
const Budget = require('../models/budgetModel');
const Event = require('../models/eventModel');

// Create or update budget for an event
router.post('/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { items } = req.body;

    // Calculate total_price for each item and total_budget
    let total_budget = 0;
    const processedItems = items.map((item) => {
      const total_price = item.quantity * item.unit_price;
      total_budget += total_price;
      return { ...item, total_price };
    });

    // Check if budget already exists for the event
    let budget = await Budget.findOne({ event_id: eventId });

    if (budget) {
      // If status is not 'pending', prevent editing
      if (budget.status !== 'pending') {
        return res.status(400).json({ message: 'Cannot edit budget unless status is pending.' });
      }
      // Update existing budget
      budget.items = processedItems;
      budget.total_budget = total_budget;
      budget.status = 'hold'; // Set status to 'hold' after submission
      await budget.save();
    } else {
      // Create new budget
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found.' });
      }

      budget = new Budget({
        event_id: event._id,
        event_name: event.event_name,
        items: processedItems,
        total_budget,
        status: 'hold',
      });
      await budget.save();

      // Update event status to 'budget'
      event.status = 'budget';
      await event.save();
    }

    res.status(200).json({ message: 'Budget submitted successfully.', budget });
  } catch (error) {
    console.error('Error submitting budget:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get budget by event ID
router.get('/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const budget = await Budget.findOne({ event_id: eventId });

if (!budget) {
  return res.status(404).json({ message: 'Budget not found.' });
}

// If event_name is missing, get it from Event model
if (!budget.event_name) {
  const event = await Event.findById(eventId);
  if (event) {
    budget.event_name = event.event_name;
  }
}

res.status(200).json(budget);
  } catch (error) {
    console.error('Error fetching budget:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
