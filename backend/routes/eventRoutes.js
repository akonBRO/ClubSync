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

// 6. Get events by status
router.get('/status/:status', async (req, res) => {
  try {
    const events = await Event.find({ status: req.params.status });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching by status', error: error.message });
  }
});
const deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
      const deletedEvent = await Event.findByIdAndDelete(eventId);
      if (!deletedEvent) {
          return res.status(404).json({ message: 'Event not found.' });
      }
      res.status(204).send(); // Successful deletion, no content to send back
  } catch (error) {
      console.error('Error deleting event:', error); // **CHECK THIS LOG**
      res.status(500).json({ message: 'Failed to delete event on the server.' });
  }
};

router.delete('/byBookingId/:bookingId', async (req, res) => {
try {
    const deleted = await Event.findOneAndDelete({ booking_id: req.params.bookingId });
    if (!deleted) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
} catch (error) {
    res.status(500).json({ message: 'Deletion failed', error: error.message });
}
});

module.exports = router;
