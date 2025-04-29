import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentRegister from './pages/StudentRegister';
import HomePage from './pages/HomePage';
import ClubRegister from './pages/ClubRegister';
import ClubLogin from './pages/ClubLogin';
import ClubSidebar from './pages/ClubSidebar'; // Correct import path for ClubSidebar
// Import the page components for the dashboard sub-routes
// Make sure you have created these files in your 'pages' directory
import ClubDashboard from './pages/ClubDashboard'; // ClubDashboard is the overview
import ClubEvents from './pages/ClubEvents';
import ClubRecruitments from './pages/ClubRecruitments';
import ClubMembers from './pages/ClubMembers';
import ClubProfile from './pages/ClubProfile';
import ClubSettings from './pages/ClubSettings';
import styles from './App.module.css'; // Import a CSS module for App.js


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register-student" element={<StudentRegister />} />
                <Route path="/register-club" element={<ClubRegister />} />
                <Route path="/login-club" element={<ClubLogin />} />
                <Route path="/club/*" element={<ClubLayout />} /> {/* Use a layout component for the dashboard */}
            </Routes>
        </Router>
    );
}

function ClubLayout() {
    return (
        <div className={styles.dashboardContainer}> {/* Apply the grid layout here */}
            <ClubSidebar />
            <div className={styles.mainContentArea}> {/* New div for main content with max-width */}
                <Routes>
                    <Route path="overview" element={<ClubDashboard />} /> {/* Default dashboard view is ClubDashboard */}
                    <Route path="events" element={<ClubEvents />} />
                    <Route path="recruitments" element={<ClubRecruitments />} />
                    <Route path="members" element={<ClubMembers />} />
                    <Route path="profile" element={<ClubProfile />} />
                    <Route path="settings" element={<ClubSettings />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;