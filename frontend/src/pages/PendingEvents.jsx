import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaFileInvoiceDollar, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUserGraduate, FaInfoCircle, FaCheckCircle, FaUserFriends } from 'react-icons/fa'; // More icons
import './PendingEvents.css';

const PendingEvents = () => {
    const navigate = useNavigate();
    const [pendingEvents, setPendingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPendingEvents = async () => {
            setLoading(true);
            setError(null);
            try {
                const clubName = localStorage.getItem('clubName');
                if (!clubName) {
                    setError('Club name not found. Please log in again.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(
                    `http://localhost:3001/api/events/club/${clubName}`,
                    { withCredentials: true }
                );

                const pending = response.data.filter(event => event.status === 'Pending' || event.status === 'Budget' );
                const sortedEvents = [...pending].sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
                setPendingEvents(sortedEvents);
                setLoading(false);

            } catch (err) {
                console.error('Error fetching pending events:', err);
                setError('Failed to load pending events.');
                setLoading(false);
            }
        };

        fetchPendingEvents();
    }, [navigate]);

    const handleDeleteEvent = async (bookingId) => { // Use bookingId here
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await axios.delete(`http://localhost:3001/api/events/byBookingId/${bookingId}`, { withCredentials: true }); // Updated URL
                setPendingEvents(pendingEvents.filter(event => event.booking_id !== bookingId)); // Use bookingId for filtering
                alert('Event deleted successfully!');
            } catch (err) {
                console.error('Error deleting event:', err);
                alert('Failed to delete event.');
            }
        }
    };

    const handleBudgetClick = (eventId) => {
        console.log("handleBudgetClick called with eventId:", eventId);
        navigate(`/club/events/budget/${eventId}`);
    };
    

    return (
        <div className="pending-events-container modern">
            <h2 className="pending-events-title modern">Pending Event Requests</h2>
            {pendingEvents.length === 0 ? (
                <p className="no-pending-events modern">No pending event requests at the moment.</p>
            ) : (
                <ul className="pending-events-list modern">
                    {pendingEvents.map((event, index) => (
                        <li key={event.booking_id} className="pending-event-item modern">
                            <div className="event-header modern">
                                <span className="serial-number modern">{index + 1}.</span>
                                <h3 className="event-name modern">{event.event_name}</h3>
                                <span className="status-tag pending modern"><FaCheckCircle /> {event.status}</span>
                            </div>
                            <div className="event-details-grid modern">
                                <div className="detail-item modern"><FaCalendarAlt /> {new Date(event.event_date).toLocaleDateString()}</div>
                                <div className="detail-item modern"><FaClock /> {Array.isArray(event.time_slots) ? event.time_slots.join(', ') : event.time_slot}</div>
                                <div className="detail-item modern"><FaMapMarkerAlt /> {event.room_number}</div>
                                <div className="detail-item modern"><FaUserFriends /> {event.std_reg}</div>
                                <div className="detail-item details-long modern"><FaInfoCircle /> {event.event_details}</div>
                                <div className="detail-item comments-long modern">
                                    <strong>Comments:</strong> {event.comments || 'No comments'}
                                </div>
                            </div>
                            <div className="event-actions modern">
                                <button
                                    className="budget-button modern"
                                    onClick={() => handleBudgetClick(event.booking_id)}
                                >
                                    <FaFileInvoiceDollar /> Budget
                                </button>
                                <button
                                    className="delete-button modern"
                                    onClick={() => handleDeleteEvent(event.booking_id)}
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PendingEvents;