import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentRegister from './pages/StudentRegister';
import HomePage from './pages/HomePage';
import ClubRegister from './pages/ClubRegister';
import ClubLogin from './pages/ClubLogin';
import ClubSidebar from './pages/ClubSidebar';
import ClubDashboard from './pages/ClubDashboard';
import ClubEvents from './pages/ClubEvents';
import EventBooking from './pages/EventBooking';
import ApprovedEvents from './pages/ApprovedEvents';
import PendingEvents from './pages/PendingEvents';
import RejectedEvents from './pages/RejectedEvents';
import ClubRecruitments from './pages/ClubRecruitments';
import ClubMembers from './pages/ClubMembers';
import ClubProfile from './pages/ClubProfile';
import ClubSettings from './pages/ClubSettings';
import BudgetPage from './pages/BudgetPage';
import styles from './App.module.css';
axios.defaults.withCredentials = true;

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
                    <Route path="events/*" element={<ClubEventsRoutes />} /> {/* Nested routes for events */}
                    <Route path="recruitments" element={<ClubRecruitments />} />
                    <Route path="members" element={<ClubMembers />} />
                    <Route path="profile" element={<ClubProfile />} />
                    <Route path="settings" element={<ClubSettings />} />
                </Routes>
            </div>
        </div>
    );
}
function ClubEventsRoutes() {
    return (
        <Routes>
            <Route index element={<ClubEvents />} />
            <Route path="booking" element={<EventBooking />} />
            <Route path="approved" element={<ApprovedEvents />} />
            <Route path="pending" element={<PendingEvents />} />
            <Route path="rejected" element={<RejectedEvents />} />
            <Route path="budget/:eventId" element={<BudgetPage />} />
    
        </Routes>
    );
}
export default App;