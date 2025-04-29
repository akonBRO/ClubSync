// pages/ClubEvents.jsx
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from './ClubEvents.module.css';
import { FaPlusCircle, FaCheckCircle, FaClock, FaBan, FaCalendarAlt, FaChartBar } from 'react-icons/fa'; // More icons

const ClubEvents = () => {
    const navigate = useNavigate();

    // Dummy counts - you'll fetch these later
    const approvedCount = 15;
    const pendingCount = 5;
    const rejectedCount = 2;

    const handleCreateNewEvent = () => {
        navigate("booking"); // Navigate to the booking page
    };

    return (
        <div className={styles.eventsContainer}>
            <div className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h2 className={styles.heroTitle}>Event Dashboard</h2>
                    <p className={styles.heroSubtitle}>Manage and organize all your club's events effectively.</p>
                    <button className={styles.primaryButton} onClick={handleCreateNewEvent}>
                        <FaPlusCircle className={styles.buttonIcon} />
                        Create New Event
                    </button>
                </div>
                <div className={styles.heroImage}>
                    <FaCalendarAlt className={styles.heroIcon} />
                </div>
            </div>

            <div className={styles.analyticsSection}>
                <h3 className={styles.analyticsTitle}>Quick Analytics</h3>
                <div className={styles.analyticsGrid}>
                    <div className={`${styles.analyticsCard} ${styles.approved}`}>
                        <FaCheckCircle className={styles.analyticsIcon} />
                        <span className={styles.analyticsLabel}>Approved</span>
                        <span className={styles.analyticsCount}>{approvedCount}</span>
                    </div>
                    <div className={`${styles.analyticsCard} ${styles.pending}`}>
                        <FaClock className={styles.analyticsIcon} />
                        <span className={styles.analyticsLabel}>Pending</span>
                        <span className={styles.analyticsCount}>{pendingCount}</span>
                    </div>
                    <div className={`${styles.analyticsCard} ${styles.rejected}`}>
                        <FaBan className={styles.analyticsIcon} />
                        <span className={styles.analyticsLabel}>Rejected</span>
                        <span className={styles.analyticsCount}>{rejectedCount}</span>
                    </div>
                    <div className={styles.analyticsCard}>
                        <FaChartBar className={styles.analyticsIcon} />
                        <span className={styles.analyticsLabel}>Total Events</span>
                        <span className={styles.analyticsCount}>{approvedCount + pendingCount + rejectedCount}</span>
                    </div>
                </div>
            </div>

            <nav className={styles.eventsNav}>
                <NavLink
                    to="booking"
                    className={({ isActive }) => isActive ? styles.activeTab : styles.tab}
                >
                    <div className={styles.navItem}>
                        <FaPlusCircle className={styles.tabIcon} />
                        Book Event
                        {/* No count needed here as it's for booking */}
                    </div>
                </NavLink>
                <NavLink
                    to="approved"
                    className={({ isActive }) => isActive ? styles.activeTab : styles.tab}
                >
                    <div className={styles.navItem}>
                        <FaCheckCircle className={`${styles.tabIcon} ${styles.approvedColor}`} />
                        Approved Events
                        <span className={styles.tabCount}>{approvedCount}</span>
                    </div>
                </NavLink>
                <NavLink
                    to="pending"
                    className={({ isActive }) => isActive ? styles.activeTab : styles.tab}
                >
                    <div className={styles.navItem}>
                        <FaClock className={`${styles.tabIcon} ${styles.pendingColor}`} />
                        Pending Events
                        <span className={styles.tabCount}>{pendingCount}</span>
                    </div>
                </NavLink>
                <NavLink
                    to="rejected"
                    className={({ isActive }) => isActive ? styles.activeTab : styles.tab}
                >
                    <div className={styles.navItem}>
                        <FaBan className={`${styles.tabIcon} ${styles.rejectedColor}`} />
                        Rejected Events
                        <span className={styles.tabCount}>{rejectedCount}</span>
                    </div>
                </NavLink>
            </nav>

            <div className={styles.outletContainer}>
                <Outlet /> {/* This is where the content of the sub-routes will be rendered */}
            </div>
        </div>
    );
};

export default ClubEvents;