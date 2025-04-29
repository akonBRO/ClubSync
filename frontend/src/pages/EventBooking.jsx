import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    FileText,
    CheckCircle,
    Info,
    Book
} from 'lucide-react';
import './EventBooking.css';

const EventBooking = () => {
    const [formData, setFormData] = useState({
        club_name: localStorage.getItem('clubName') || 'Club',
        event_name: '',
        event_date: '',
        time_slots: [],
        room_number: '',
        std_reg: '',
        event_details: '',
    });
    const [loading, setLoading] = useState(true);
    const [availableTimeSlots] = useState([
        '09:30 AM-10:50 AM', '11:00 AM-12:20 PM', '12:30 PM-01:50 PM',
        '02:00 PM - 03:20 PM', '03:30 PM - 04:50 PM', '05:00 PM - 06:20 PM'
    ]);
    const [minDate, setMinDate] = useState('');

    const roomNumbers = [
        '12B-30L', '12B-31L', '12D-26L', '12D-27L', '12D-28L',
        'Club Room 1', 'Club Room 2', 'Club Room 3', 'Club Room 4',
        'Lecture Theatre 1', 'Lecture Theatre 2', 'Lecture Theatre 3',
        'Multi Purpose Hall', 'Auditorium'
    ];
    useEffect(() => {
        axios.get('http://localhost:3001/api/clubs/dashboard', { withCredentials: true })
            .then(response => {
                if (response.data.clubName) {
                    setFormData(prev => ({
                        ...prev,
                        club_name: response.data.clubName
                    }));
                }
            })
            .catch(error => {
                console.error('Error fetching club name:', error);
            })
            .finally(() => setLoading(false));
        // Set the minimum date to 5 days from today
        const today = new Date();
        today.setDate(today.getDate() + 5);
        const minDateString = today.toISOString().split('T')[0];
        setMinDate(minDateString);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTimeSlotChange = (slot) => {
        setFormData(prev => {
            let selectedSlots = prev.time_slots;
            if (selectedSlots.includes(slot)) {
                selectedSlots = selectedSlots.filter(s => s !== slot);
            } else if (selectedSlots.length < 2) {
                selectedSlots = [...selectedSlots, slot];
            }
            return { ...prev, time_slots: selectedSlots };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { event_name, event_date, time_slots, room_number, std_reg, event_details } = formData;
        if (!event_name || !event_date || time_slots.length === 0 || !room_number || !std_reg || !event_details) {
            alert('All fields are required.');
            return;
        }
        if (time_slots.length > 2) {
            alert('You can select a maximum of two time slots.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/api/events/booking', formData);
            alert(`Booking Successful! Your Booking ID: ${response.data.bookingId}`);
            setFormData({ club_name:'', event_name: '', event_date: '', time_slots: [], room_number: '', std_reg: '', event_details: '' });
        } catch (error) {
            if (error.response && error.response.data.message === 'Slot is not available.') {
                alert('One or more selected time slots are not available. Please choose other slots.');
            } else {
                console.error('Error while submitting event:', error);
                alert('One or more selected slots are not available for this time and room.');
            }
        }
    };

    if (loading) {
        return (
            <div className="event-booking-container full-page-form flex items-center justify-center">
                <div className="text-center">
                    <Book className="animate-spin text-4xl text-blue-500 mb-4" />
                    <p className="text-lg text-gray-700">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="event-booking-container full-page-form">
            <h2 className="form-heading">
                <Book className="inline-block mr-2" />
                Book an Event
            </h2>
            <form onSubmit={handleSubmit} className="event-booking-form">
                <div className="form-group">
                    <label>
                        <Users className="inline-block mr-2" />
                        Club Name
                    </label>
                    <input type="text" name="club_name" value={formData.club_name} readOnly />
                </div>

                <div className="form-group">
                    <label>
                        <FileText className="inline-block mr-2" />
                        Event Name
                    </label>
                    <input type="text" name="event_name" value={formData.event_name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>
                        <Calendar className="inline-block mr-2" />
                        Event Date
                    </label>
                    <input
                        type="date"
                        name="event_date"
                        value={formData.event_date}
                        onChange={handleDateChange}
                        required
                        min={minDate} // Set the minimum date here
                    />
                    {formData.event_date && formData.event_date < minDate && (
                        <p className="error-message">
                            <Info className="inline-block mr-1" size={16} />
                            Event date must be at least 5 days from today.
                        </p>
                    )}
                </div>

                <div className="form-group">
                    <label>
                        <Clock className="inline-block mr-2" />
                        Time Slot(s) (Max 2)
                    </label>
                    <div className="time-slots-container">
                        {availableTimeSlots.map(slot => (
                            <button
                                key={slot}
                                type="button"
                                className={formData.time_slots.includes(slot) ? 'time-slot-button selected' :
                                    formData.time_slots.length < 2 ? 'time-slot-button' : 'time-slot-button disabled'}
                                onClick={() => handleTimeSlotChange(slot)}
                                disabled={formData.time_slots.length >= 2 && !formData.time_slots.includes(slot)}

                            >
                                {slot}
                                {formData.time_slots.includes(slot) ?
                                    <CheckCircle className="inline-block ml-2" size={16} /> :
                                    <Clock className="inline-block ml-2" size={16} />}
                            </button>
                        ))}
                    </div>
                    {formData.time_slots.length > 0 && (
                        <p className="selected-slots-text">
                            Selected Slots: {formData.time_slots.join(', ')}
                        </p>
                    )}
                    {formData.time_slots.length >= 2 && (
                        <p className="max-slots-text">
                            <Info className="inline-block mr-1" size={16} />
                            Maximum two time slots can be selected.
                        </p>
                    )}
                </div>

                <div className="form-group">
                    <label>
                        <MapPin className="inline-block mr-2" />
                        Room Number
                    </label>
                    <select name="room_number" value={formData.room_number} onChange={handleChange} required>
                        <option value="">Select</option>
                        {roomNumbers.map(room => (
                            <option key={room} value={room}>{room}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>
                        <Users className="inline-block mr-2" />
                        Student Registration
                    </label>
                    <select name="std_reg" value={formData.std_reg} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>
                        <FileText className="inline-block mr-2" />
                        Event Description
                    </label>
                    <textarea name="event_details" rows="5" value={formData.event_details} onChange={handleChange} required></textarea>
                </div>

                <button type="submit" className="submit-btn colorful-btn">
                    <CheckCircle className="inline-block mr-2" />
                    Submit Booking
                </button>
            </form>
        </div>
    );
};

export default EventBooking;

