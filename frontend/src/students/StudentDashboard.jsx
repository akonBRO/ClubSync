import React, { useState, useEffect } from 'react';
import styles from './StudentDashboard.module.css';
import { FaCalendarAlt, FaUsers, FaUserCircle, FaBell, FaBullhorn } from 'react-icons/fa';

const StudentDashboard = () => {
    const [studentName, setStudentName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [upcomingEventsCount, setUpcomingEventsCount] = useState(0);
    const [enrolledClubsCount, setEnrolledClubsCount] = useState(0);
    const [newAnnouncementsCount, setNewAnnouncementsCount] = useState(0);
    const [profileSnapshot, setProfileSnapshot] = useState({});
    const [upcomingEventsList, setUpcomingEventsList] = useState([]);
    const [enrolledClubsList, setEnrolledClubsList] = useState([]);
    const [latestAnnouncementsList, setLatestAnnouncementsList] = useState([]);

    useEffect(() => {
        const storedStudentName = localStorage.getItem('studentName');
        const storedStudentId = localStorage.getItem('studentId');

        if (storedStudentName && storedStudentId) {
            setStudentName(storedStudentName ? storedStudentName : 'Student');
            setStudentId(storedStudentId);
            fetchStudentDashboardData(storedStudentId);
        }
    }, []);

    const fetchStudentDashboardData = async (studentId) => {
        // Dummy data - replace with your API calls
        setUpcomingEventsCount(3);
        setEnrolledClubsCount(2);
        setNewAnnouncementsCount(2);
        setProfileSnapshot({ major: 'Computer Science' });
        setUpcomingEventsList([
            { id: 1, title: 'Club Fair', date: 'May 6, 2025', location: 'Main Hall' },
            { id: 2, title: 'Student Union Meeting', date: 'May 9, 2025', time: '3:00 PM' },
            { id: 3, title: 'Workshop: Time Management', date: 'May 11, 2025', time: '10:00 AM' },
        ]);
        setEnrolledClubsList(['Photography Club', 'Music Society']);
        setLatestAnnouncementsList([
            { id: 1, title: 'Call for Volunteers - Campus Cleanup', date: 'May 5, 2025' },
            { id: 2, title: 'New Club Added: Robotics Club', date: 'May 4, 2025' },
        ]);
    };

    return (
        <main className={styles.mainContent}>
            <div className={styles.dashboardContainer}>
                <header className={styles.header}>
                    <div className={styles.greetingSection}>
                        <h1 className={styles.greeting}>Hello, {studentName}</h1>
                        <p className={styles.studentInfo}>{profileSnapshot.major || 'Welcome to your dashboard!'}</p>
                    </div>
                    <div className={styles.summarySection}>
                        <div className={styles.summaryCard}>
                            <FaCalendarAlt className={styles.summaryIcon} />
                            <div className={styles.summaryText}>
                                <span className={styles.summaryValue}>{upcomingEventsCount}</span>
                                <span className={styles.summaryLabel}>Upcoming Events</span>
                            </div>
                        </div>
                        <div className={styles.summaryCard}>
                            <FaUsers className={styles.summaryIcon} />
                            <div className={styles.summaryText}>
                                <span className={styles.summaryValue}>{enrolledClubsCount}</span>
                                <span className={styles.summaryLabel}>Enrolled Clubs</span>
                            </div>
                        </div>
                        <div className={styles.summaryCard}>
                            <FaBullhorn className={styles.summaryIcon} />
                            <div className={styles.summaryText}>
                                <span className={styles.summaryValue}>{newAnnouncementsCount}</span>
                                <span className={styles.summaryLabel}>New Announcements</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className={styles.dashboardBody}>
                    <section className={styles.leftSection}>
                        <div className={styles.widget}>
                            <h2 className={styles.widgetTitle}><FaCalendarAlt className={styles.widgetIcon} /> Upcoming Events</h2>
                            {upcomingEventsList.length > 0 ? (
                                <ul className={styles.widgetList}>
                                    {upcomingEventsList.map(event => (
                                        <li key={event.id} className={styles.widgetListItem}>
                                            <span className={styles.listItemTitle}>{event.title}</span>
                                            <span className={styles.listItemMeta}>{event.date} {event.time && `(${event.time})`}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className={styles.noData}>No upcoming events.</p>
                            )}
                            <button className={styles.viewAllButton}>View All Events</button>
                        </div>

                        <div className={styles.widget}>
                            <h2 className={styles.widgetTitle}><FaUsers className={styles.widgetIcon} /> Your Clubs</h2>
                            {enrolledClubsList.length > 0 ? (
                                <div className={styles.clubTagContainer}>
                                    {enrolledClubsList.map(club => (
                                        <span key={club} className={styles.clubTag}>{club}</span>
                                    ))}
                                </div>
                            ) : (
                                <p className={styles.noData}>Not enrolled in any clubs yet.</p>
                            )}
                            <button className={styles.viewAllButton}>Explore Clubs</button>
                        </div>
                    </section>

                    <section className={styles.rightSection}>
                        <div className={styles.widget}>
                            <h2 className={styles.widgetTitle}><FaBullhorn className={styles.widgetIcon} /> Latest Announcements</h2>
                            {latestAnnouncementsList.length > 0 ? (
                                <ul className={styles.widgetList}>
                                    {latestAnnouncementsList.map(announcement => (
                                        <li key={announcement.id} className={styles.widgetListItem}>
                                            <span className={styles.listItemTitle}>{announcement.title}</span>
                                            <span className={styles.listItemMeta}>{announcement.date}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className={styles.noData}>No new announcements.</p>
                            )}
                            <button className={styles.viewAllButton}>View All Announcements</button>
                        </div>

                        <div className={styles.userProfileWidget}>
                            <div className={styles.profileHeader}>
                                <FaUserCircle className={styles.profileIcon} />
                                <h3 className={styles.profileName}>{studentName}</h3>
                            </div>
                            <p className={styles.profileDetail}>Student ID: {studentId}</p>
                            <p className={styles.profileDetail}>Major: {profileSnapshot.major || 'N/A'}</p>
                            <button className={styles.viewProfileButton}>View Profile</button>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default StudentDashboard;