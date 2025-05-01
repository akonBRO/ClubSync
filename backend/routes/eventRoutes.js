const express = require('express');
const router = express.Router();
const Event = require('../models/eventModel');
const { v4: uuidv4 } = require('uuid');

const generateEId = async () => {
  let eid;
  let isUnique = false;

  while (!isUnique) {
    eid = Math.floor(10000000 + Math.random() * 90000000).toString();
    const existingEvent = await Event.findOne({ eid: eid });
    if (!existingEvent) {
      isUnique = true;
    }
  }
  return eid;
};

// Check if a room slot is available
const isSlotAvailable = async (eventDate, timeSlotToCheck, roomNumber) => {
    const existingEvent = await Event.findOne({
      event_date: eventDate,
      room_number: roomNumber,
      time_slots: { $in: [timeSlotToCheck] } // Check if the timeSlotToCheck exists within the time_slots array of any existing event
    });
    return !existingEvent;
  };
  

// 1. Create new event
// routes/index.js
router.post('/booking', async (req, res) => {
    try {
      const { club_name, event_name, event_date, time_slots, room_number, std_reg, event_details } = req.body;
  
      if (!event_name || !event_date || !time_slots || time_slots.length === 0 || !room_number || !club_name) {
        return res.status(400).json({ message: 'All required fields must be provided.' });
      }
  
      // Check availability for all requested time slots
      const availabilityResults = await Promise.all(
        time_slots.map(slot => isSlotAvailable(event_date, slot, room_number))
      );
  
      if (availabilityResults.some(available => !available)) {
        return res.status(400).json({ message: 'One or more selected slots are not available for this time and room.' });
      }
      const eid = await generateEId();
  
      const newEvent = new Event({
        booking_id: uuidv4(),
        eid: eid,
        club_name: club_name || null,
        event_name: event_name || null,
        event_date: event_date ? new Date(event_date) : null,
        time_slots: time_slots, // Save as an array
        room_number: room_number || null,
        std_reg: std_reg || null,
        event_details: event_details || null,
        status: 'Pending',
        comments: null,
      });
  
      await newEvent.save();
      res.status(201).json({ message: 'Event booked successfully!', event: newEvent });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create event', error: error.message });
    }
  });

// 2. Get all events
router.get('/booking/:bookingId', async (req, res) => {
  try {
    const event = await Event.findOne({ booking_id: req.params.bookingId });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ event });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get event by bookingId', error: error.message });
  }
});


// 3. Get events by club
router.get('/club/:clubName', async (req, res) => {
  try {
    const events = await Event.find({ club_name: req.params.clubName });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

// 4. Update event
router.put('/:id', async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Event not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
});

// 5. Delete event
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Deletion failed', error: error.message });
  }
});

// GET /api/events/status/:status?search=EID_VALUE
router.get('/status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const { search } = req.query; // Get search term from query params

    // Basic validation for status if needed
    const allowedStatuses = ['Pending', 'Approved', 'Rejected', 'Budget'];
    if (!allowedStatuses.includes(status)) {
         return res.status(400).json({ message: 'Invalid status value.' });
    }

    let query = { status: status }; // Base query

    // If search term exists, add EID filter (case-insensitive)
    if (search) {
      // Assuming EID is a string. Use regex for partial matching.
      query.eid = { $regex: search, $options: 'i' };
    }

    // Find events matching the query, sort by event_date ascending
    const events = await Event.find(query).sort({ event_date: 1 }); // 1 for ascending

    res.json(events); // Send back the array of events

  } catch (error) {
    console.error(`Error fetching events by status=${req.params.status}:`, error);
    res.status(500).json({ message: 'Error fetching events by status', error: error.message });
  }
});


// --- DELETE Route (using MongoDB _id) ---
// DELETE /api/events/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
         return res.status(400).json({ message: 'Invalid event ID format.' });
    }

    const deleted = await Event.findByIdAndDelete(id);

    if (!deleted) {
         return res.status(404).json({ message: 'Event not found with the provided ID.' });
    }

    // Send success response (no content needed, or a simple message)
    res.status(200).json({ message: 'Event deleted successfully' });
    // Or use: res.status(204).send();

  } catch (error) {
    console.error(`Error deleting event with id=${req.params.id}:`, error);
    res.status(500).json({ message: 'Deletion failed due to server error.', error: error.message });
  }
});


module.exports = router;

module.exports = router;
