// src/pages/ClubRecruitments.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ClubRecruitments.css'; // Import CSS file
import {
    FaPlay, FaStop, FaUsers, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaSearch, FaInfoCircle, FaSpinner, FaExclamationTriangle
} from 'react-icons/fa'; // Using react-icons

// Assume you have a predefined list of possible semesters or fetch them
const AVAILABLE_SEMESTERS = [
    "Fall 2025",
    "Spring 2026",
    "Fall 2026",
    "Spring 2027",
    // Add more as needed
];

function ClubRecruitments() {
    // --- State Variables ---
    const [clubInfo, setClubInfo] = useState(null); // Basic club info { _id, cname, cid }
    const [isRecruiting, setIsRecruiting] = useState(false); // Club's overall recruitment status ('Yes'/'No')
    const [activeSemesters, setActiveSemesters] = useState([]); // Semesters currently open for recruitment
    const [semesterData, setSemesterData] = useState([]); // Stats per active semester
    const [selectedSemester, setSelectedSemester] = useState(AVAILABLE_SEMESTERS[0] || ''); // Semester to start recruiting for
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false); // Loading state for start/stop actions

    // --- Hooks ---
    // !! WARNING: This requires the route path to include :clubId !!
    const { clubId } = useParams();
    const navigate = useNavigate();

    // --- API Base URL (Configure appropriately) ---
    const API_URL = 'http://localhost:3001/api/recruitment'; // Adjust based on your server setup

    // --- Fetch Club Recruitment Data ---
    const fetchClubData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        // Check if clubId is available before fetching
        if (!clubId) {
            setError("Club ID not found in URL. Cannot fetch data.");
            setIsLoading(false);
            return;
        }
        try {
            // Corrected: Use GET and the correct API_URL for fetching details
            const response = await axios.get(`${API_URL}/details/${clubId}`);

            const { club, activeSemesters: fetchedActiveSemesters, semesterData: fetchedSemesterData } = response.data;

            setClubInfo({ // Store only necessary info
                _id: club._id,
                cname: club.cname,
                cid: club.cid,
            });
            setIsRecruiting(club.creq === 'Yes');
            // Ensure activeSemesters is always an array
            setActiveSemesters(Array.isArray(fetchedActiveSemesters) ? fetchedActiveSemesters : []);
             // Ensure semesterData is always an array
            setSemesterData(Array.isArray(fetchedSemesterData) ? fetchedSemesterData : []);


        } catch (err) {
            console.error("Error fetching club recruitment data:", err);
            setError(err.response?.data?.message || "Failed to load recruitment data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [clubId, API_URL]); // Dependency: clubId and API_URL

    // --- Initial Data Load ---
    useEffect(() => {
        // Initial fetch now includes the check for clubId
        fetchClubData();
    }, [fetchClubData]); // Run when fetchClubData changes

    // --- Handle Start Recruitment ---
    const handleStartRecruitment = async () => {
        if (!clubId) {
             setError("Club ID not available. Cannot start recruitment.");
             return;
         }
        if (!selectedSemester) {
            setError("Please select a semester to start recruitment.");
            return;
        }
        setActionLoading(true);
        setError(null);
        try {
            // Call the refined '/set-recruitment' endpoint using the correct API_URL
            const response = await axios.post(`${API_URL}/set-recruitment/${clubId}`, {
                semester: selectedSemester,
                recruitmentStatus: 'Yes'
            });

            // Update state based on the response from the backend
            const { club: updatedClub, semesterData: updatedSemesterData } = response.data;
            setIsRecruiting(updatedClub.creq === 'Yes');
            setActiveSemesters(updatedClub.semester || []);
            setSemesterData(updatedSemesterData || []);
            // Optionally clear selection or set to next logical semester
            // setSelectedSemester(AVAILABLE_SEMESTERS[0] || '');


        } catch (err) {
            console.error("Error starting recruitment:", err);
            setError(err.response?.data?.message || "Failed to start recruitment.");
        } finally {
            setActionLoading(false);
        }
    };

    // --- Handle Stop Recruitment ---
    const handleStopRecruitment = async () => {
        if (!clubId) {
             setError("Club ID not available. Cannot stop recruitment.");
             return;
         }
        setActionLoading(true);
        setError(null);
        try {
            // Call the refined '/set-recruitment' endpoint to turn OFF using the correct API_URL
            const response = await axios.post(`${API_URL}/set-recruitment/${clubId}`, {
                recruitmentStatus: 'No'
                // No semester needed when stopping
            });

            // Update state based on the response
             const { club: updatedClub, semesterData: updatedSemesterData } = response.data;
             setIsRecruiting(updatedClub.creq === 'Yes'); // Should be false now
             setActiveSemesters(updatedClub.semester || []); // Should be empty now
             setSemesterData(updatedSemesterData || []); // Should reflect no active semesters


        } catch (err) {
            console.error("Error stopping recruitment:", err);
            setError(err.response?.data?.message || "Failed to stop recruitment.");
        } finally {
            setActionLoading(false);
        }
    };

    // --- Handle Navigate to Evaluation Page ---
    const handleEvaluate = (semester) => {
        // Navigate to the evaluation route, passing clubId and semester
        // Assuming the route is /club/:clubId/recruitments/evaluate/:semester
         if (clubId) {
             navigate(`/club/${clubId}/recruitments/evaluate/${encodeURIComponent(semester)}`);
         } else {
             setError("Club ID not available for navigation.");
         }
    };

    // --- Render Logic ---
    // Handle the case where clubId is missing immediately
     if (!clubId && !isLoading) {
         return <div className="error-message"><FaExclamationTriangle /> Club ID is missing from the URL. Please navigate via the Club Dashboard.</div>;
     }


    if (isLoading) {
        return <div className="loading-container"><FaSpinner className="spinner" /> Loading Recruitment Data...</div>;
    }


    // Determine which semesters are available to start recruiting for (not already active)
    const availableSemestersForStarting = AVAILABLE_SEMESTERS.filter(
        sem => !activeSemesters.includes(sem)
    );


    return (
        <div className="recruitment-page-container">
            {clubInfo && (
                <header className="recruitment-header">
                    <h1>{clubInfo.cname} - Recruitment Management</h1>
                    <p className="club-id">Club ID: {clubInfo.cid}</p>
                </header>
            )}

            {error && <div className="error-message"><FaExclamationTriangle /> {error}</div>}

            <section className="status-control-section">
                <div className={`status-indicator ${isRecruiting ? 'active' : 'inactive'}`}>
                    <FaInfoCircle />
                    <span>Recruitment Status: {isRecruiting ? 'Active' : 'Inactive'}</span>
                </div>

                {isRecruiting ? (
                    // --- Controls when ACTIVE ---
                    <div className="recruitment-actions">
                         {/* Option to add another semester */}
                         {availableSemestersForStarting.length > 0 && (
                            <div className="start-recruitment-form add-semester-form">
                                <select
                                    value={selectedSemester}
                                    onChange={(e) => setSelectedSemester(e.target.value)}
                                    disabled={actionLoading}
                                >
                                    <option value="" disabled>Select semester to add...</option>
                                    {availableSemestersForStarting.map(sem => (
                                        <option key={sem} value={sem}>{sem}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleStartRecruitment}
                                    disabled={actionLoading || !selectedSemester || !clubId} // Disable if clubId is missing
                                    className="action-button start-button"
                                >
                                    {actionLoading ? <FaSpinner className="spinner-button" /> : <><FaPlay /> Add Recruitment Semester</>}
                                </button>
                            </div>
                        )}
                         <button
                            onClick={handleStopRecruitment}
                            disabled={actionLoading || !clubId} // Disable if clubId is missing
                            className="action-button stop-button"
                        >
                            {actionLoading ? <FaSpinner className="spinner-button" /> : <><FaStop /> Stop All Recruitment</>}
                        </button>
                    </div>
                ) : (
                    // --- Controls when INACTIVE ---
                    <div className="recruitment-actions">
                         {availableSemestersForStarting.length > 0 ? (
                            <div className="start-recruitment-form">
                                <select
                                    value={selectedSemester}
                                    onChange={(e) => setSelectedSemester(e.target.value)}
                                    disabled={actionLoading}
                                >
                                     <option value="" disabled>Select semester to start...</option>
                                    {/* Show all available semesters if none are active */}
                                    {AVAILABLE_SEMESTERS.map(sem => (
                                        <option key={sem} value={sem}>{sem}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleStartRecruitment}
                                    disabled={actionLoading || !selectedSemester || !clubId} // Disable if clubId is missing
                                    className="action-button start-button"
                                >
                                    {actionLoading ? <FaSpinner className="spinner-button" /> : <><FaPlay /> Start Recruitment</>}
                                </button>
                             </div>
                        ) : (
                            <p>All available semesters are already active or no semesters defined.</p>
                        )}
                    </div>
                )}
            </section>

            {/* Only show active semesters if recruiting is ON and there are active semesters */}
            {isRecruiting && activeSemesters.length > 0 && (
                <section className="active-semesters-section">
                    <h2>Active Recruitment Semesters</h2>
                    <div className="semester-grid">
                         {/* Map over semesterData, which only includes active semesters */}
                        {semesterData.map((data) => (
                            <div key={data.semester} className="semester-card">
                                <h3>{data.semester}</h3>
                                <div className="semester-stats">
                                    <p><FaUsers /> Total Applicants: <span>{data.totalApplicants}</span></p>
                                    <p><FaHourglassHalf /> Pending: <span>{data.pending}</span></p>
                                    <p><FaCheckCircle className="accepted-icon"/> Accepted: <span>{data.accepted}</span></p>
                                    <p><FaTimesCircle className="rejected-icon"/> Rejected: <span>{data.rejected}</span></p>
                                </div>
                                <div className="semester-actions">
                                    <button
                                        onClick={() => handleEvaluate(data.semester)}
                                        className="action-button evaluate-button"
                                         disabled={!clubId} // Disable if clubId is missing
                                    >
                                        <FaSearch /> Evaluate Applicants
                                    </button>
                                    {/* Optional: Add button here to stop recruitment for *only* this semester */}
                                     {/* <button className="action-button stop-semester-button">Stop for {data.semester}</button> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            {/* Display info messages correctly */}
             {!isRecruiting && (activeSemesters.length === 0) && (
                 <section className="info-section">
                    <p><FaInfoCircle /> Recruitment is currently turned off. Select a semester and click "Start Recruitment" to begin accepting applications.</p>
                </section>
            )}
             {/* This specific message might not be reachable if isRecruiting is true but activeSemesters is empty after fetch, */}
             {/* as the fetch should return the current club state. */}
             {/* Keeping it for logical completeness if a state change could lead here */}
             {isRecruiting && activeSemesters.length === 0 && !isLoading && (
                <section className="info-section">
                    <p><FaInfoCircle /> Recruitment is ON, but no specific semesters are currently active for applications. Use the form above to add a recruitment semester.</p>
                </section>
            )}
        </div>
    );
}

export default ClubRecruitments;