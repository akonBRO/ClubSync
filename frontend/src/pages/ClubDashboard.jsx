import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ClubDashboard.module.css';
// import ClubSidebar from '../components/ClubSidebar'; // REMOVE THIS IMPORT
import { FaUsers, FaCalendarCheck, FaBullhorn, FaMoneyBillAlt, FaUserCircle, FaChevronRight, FaUpload, FaSearch, FaBell, FaCalendarPlus, FaUserPlus } from 'react-icons/fa';

const ClubDashboard = () => {
    const navigate = useNavigate();
    const [clubInfo, setClubInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recruitmentStatus, setRecruitmentStatus] = useState('Recruiting'); // Dummy state
    const [totalApplicants, setTotalApplicants] = useState(55); // Dummy state

    const recruitmentStatusStyle = {
        color: recruitmentStatus === 'Recruiting' ? '#22c55e' : '#dc2626', // Green if recruiting, red if not
        fontWeight: 'bold',
    };

    const applicantsCountStyle = {
        color: '#3b82f6', // Blue color for applicants count
        fontWeight: 'bold',
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('http://localhost:3001/api/clubs/dashboard', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        console.log('Unauthorized access to dashboard, redirecting to login.');
                        navigate('/login-club');
                        return;
                    }
                    const errorData = await response.json();
                    throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setClubInfo(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError(err.message || 'Failed to load dashboard data.');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    if (loading) {
        return <div className={styles.loading}>Loading dashboard...</div>;
    }

    if (error) {
        return <div className={styles.error}>Error loading dashboard: {error}</div>;
    }

    return (
        <main className={styles.mainContent}>
            <div className={styles.dashboardContainerInner}></div> {/* Changed to main instead of wrapping div */}
            <header className={styles.header}>
                <div className={styles.headerWelcome}>
                    Welcome Back, <span className={styles.headerUserName}>{clubInfo?.clubName || 'Club'}</span>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.uploadButton}>
                        <FaUpload /> To Be Updated
                    </button>
                    <div className={styles.searchBar}>
                        <FaSearch className={styles.searchIcon} />
                        <input type="text" placeholder="Search" className={styles.searchInput} />
                    </div>
                    <div className={styles.notificationIcon}>
                        <FaBell />
                        <span className={styles.notificationBadge}>2</span>
                    </div>
                </div>
            </header>

            <div className={styles.dashboardGrid}>
                <div className={`${styles.dashboardCard}`}>
                    <div className={styles.cardHeader}>
                        <FaUsers className={styles.cardHeaderIcon} />
                        <span className={styles.cardTitle}>Total Members</span>
                    </div>
                    <div className={styles.cardValue}>150</div>
                    <div className={styles.cardTrend}>+5 new members this week</div>
                </div>


                    <div className={`${styles.dashboardCard}`}>
                        <div className={styles.cardHeader}>
                            <FaCalendarCheck className={styles.cardHeaderIcon} />
                            <span className={styles.cardTitle}>Upcoming Events</span>
                        </div>
                        <div className={styles.cardValue}>3</div>
                        <div className={styles.cardTrend}>View schedule</div>
                    </div>
                    <div className={`${styles.dashboardCard}`}>
                        <div className={styles.cardHeader}>
                            <FaCalendarPlus className={styles.cardHeaderIcon} /> {/* Changed icon */}
                            <span className={styles.cardTitle}>Pending Events</span> {/* Changed title */}
                        </div>
                        <div className={styles.cardValue}>1</div> {/* Dummy value */}
                        <div className={styles.cardTrend}>Manage events</div> {/* Changed trend text */}
                    </div>
                    <div className={`${styles.dashboardCard}`}>
                        <div className={styles.cardHeader}>
                            <FaBullhorn className={styles.cardHeaderIcon} />
                            <span className={styles.cardTitle}>Active Announcements</span>
                        </div>
                        <div className={styles.cardValue}>2</div>
                        <div className={styles.cardTrend}>See details</div>
                    </div>

                    <div className={`${styles.dashboardCard}`}>
                    <div className={styles.cardHeader}>
                        <FaUserPlus className={styles.cardHeaderIcon} /> {/* Using FaUserPlus for recruitment */}
                        <span className={styles.cardTitle}>Recruitment Status</span> {/* Changed title */}
                    </div>
                    <div className={styles.cardValue} style={recruitmentStatusStyle}>{recruitmentStatus}</div> {/* Apply dynamic style */}
                    <div className={styles.cardTrend}>Total Applicants: <span style={applicantsCountStyle}>{totalApplicants}</span></div> {/* Apply style to applicants count */}
                </div>

                <div className={`${styles.dashboardCard} ${styles.balancesCard}`}>
                    <h2>Club Funds</h2>
                    <div className={styles.balanceItem}>
                        <div className={styles.balanceLabel}>Current Balance</div>
                        <div className={styles.balanceValue}> ৳1200</div>
                    </div>
                    <button className={styles.withdrawButton}>Manage Funds</button>
                </div>
            </div>
        </main>
    );
};

export default ClubDashboard;