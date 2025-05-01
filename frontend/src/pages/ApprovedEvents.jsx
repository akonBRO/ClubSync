import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, FileText, Trash2, Eye, Search, ListFilter, Loader, AlertTriangle } from 'lucide-react'; // Using Lucide
import { debounce } from 'lodash'; // Install: npm install lodash or yarn add lodash
import './ApprovedEvents.css'; // Create this CSS file

const ApprovedEventsPage = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // --- Fetch Approved Events Function ---
    const fetchApprovedEvents = useCallback(async (currentSearchTerm) => {
        setIsLoading(true);
        setError('');
        try {
            // Use the enhanced backend route
            const response = await axios.get(`http://localhost:3001/api/events/status/Approved`, {
                params: { search: currentSearchTerm } // Pass search term as query param
            });
            setEvents(response.data);
        } catch (err) {
            console.error("Error fetching approved events:", err);
            setError(err.response?.data?.message || "Failed to load approved events. Please try again.");
            setEvents([]); // Clear events on error
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array means this function reference doesn't change

    // --- Debounced Fetch Function ---
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedFetch = useCallback(
        debounce((term) => {
            fetchApprovedEvents(term);
        }, 500), // Adjust debounce delay (e.g., 500ms)
        [fetchApprovedEvents] // Dependency: the fetch function itself
    );

    // --- Initial Fetch and Fetch on Search Term Change ---
    useEffect(() => {
        debouncedFetch(searchTerm);
        // Cleanup function to cancel debounce on unmount
        return () => {
            debouncedFetch.cancel();
        };
    }, [searchTerm, debouncedFetch]);

    // --- Handle Search Input Change ---
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // --- Handle Delete ---
    const handleDelete = async (eventId, eventName) => {
        // Confirmation dialog
        if (window.confirm(`Are you sure you want to delete the event "${eventName}" (ID: ${eventId})? This action cannot be undone.`)) {
            try {
                // Call the DELETE API using the event's MongoDB _id
                await axios.delete(`http://localhost:3001/api/events/${eventId}`);
                // Update UI by removing the event from the state
                setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
                alert(`Event "${eventName}" deleted successfully.`); // Simple feedback
            } catch (err) {
                console.error("Error deleting event:", err);
                setError(err.response?.data?.message || "Failed to delete event.");
            }
        }
    };

    // --- Handle View Budget Navigation ---
    const handleViewBudget = (bookingId) => {
        // Navigate to the budget page using the booking_id
        navigate(`/club/events/budget/${bookingId}`);
    };

    // --- Helper function to format date and time ---
    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    return (
        <div className="approved-events-container">
            <header className="approved-events-header">
                <h1>Approved Events</h1>
                <div className="search-bar">
                    <Search size={20} className="search-icon" />
                    <input
                        type="search" // Use type="search" for potential browser features
                        placeholder="Search by Event ID (EID)..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                </div>
            </header>

            {/* Loading State */}
            {isLoading && (
                <div className="loading-container">
                    <Loader className="spinner" size={40} /> Loading Events...
                </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <div className="alert alert-error"><AlertTriangle /> {error}</div>
            )}

            {/* Events List / No Events Message */}
            {!isLoading && !error && (
                <div className="events-list">
                    {events.length === 0 ? (
                        <div className="no-events-message">
                            No approved events found{searchTerm ? ` matching "${searchTerm}"` : ''}.
                        </div>
                    ) : (
                        events.map(event => (
                            <div key={event._id} className="event-card">
                                <div className="event-card-header">
                                    <h3 className="event-name">{event.event_name}</h3>
                                    <span className="event-eid">EID: {event.eid}</span>
                                </div>
                                <div className="event-card-body">
                                    <div className="event-detail">
                                        <Calendar size={16} />
                                        <span>{formatDateTime(event.event_date)}</span>
                                    </div>
                                    <div className="event-detail">
                                        <Clock size={16} />
                                        <span>{event.time_slots?.join(', ') || 'N/A'}</span>
                                    </div>
                                    <div className="event-detail">
                                        <MapPin size={16} />
                                        <span>{event.room_number || 'N/A'}</span>
                                    </div>
                                    <div className="event-detail">
                                        <Users size={16} />
                                        <span>{event.club_name || 'N/A'}</span>
                                    </div>
                                     <div className="event-detail event-description">
                                         <FileText size={16} />
                                         <p>{event.event_details || 'No description available.'}</p>
                                     </div>
                                </div>
                                <div className="event-card-actions">
                                    <button
                                        onClick={() => handleViewBudget(event.booking_id)}
                                        className="btn btn-secondary btn-icon-text"
                                        title="View Budget Details"
                                    >
                                        <Eye size={16} /> Budget
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event._id, event.event_name)}
                                        className="btn btn-danger btn-icon-text"
                                        title="Delete Event"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ApprovedEventsPage;