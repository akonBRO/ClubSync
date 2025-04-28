import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink} from 'react-router-dom';
import styles from './ClubDashboard.module.css';

const ClubDashboard = () => {
  const navigate = useNavigate();
  
  const [clubInfo, setClubInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/clubs/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Logout successful, redirecting to login.');
        navigate('/login-club');
      } else {
        const data = await response.json();
        alert(data?.message || 'Logout failed.');
      }
    } catch (err) {
      console.error('Logout error:', err);
      alert('Logout failed due to a network error.');
    }
  };

  const menuItems = [
    { path: '/club-dashboard/overview', label: 'Overview' },
    { path: '/club-dashboard/events', label: 'Events' },
    { path: '/club-dashboard/members', label: 'Members' },
    { path: '/club-dashboard/settings', label: 'Settings' },
  ];

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error loading dashboard: {error}</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <h2>Menu</h2>
        <nav>
          {menuItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                styles.menuItem + (isActive ? ` ${styles.activeMenuItem}` : '')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.dashboardHeader}>
          <h1>{clubInfo?.message || 'Club Dashboard'}</h1>
          {clubInfo?.clubId && <p className={styles.clubId}>Club ID: {clubInfo.clubId}</p>}
          <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
        </header>

        <section className={styles.dashboardSection}>
          <h2>Overview</h2>
          <p>Welcome to your club's dashboard! Manage your club effectively.</p>
          {clubInfo?.clubDetails?.cname && <p>Club Name: {clubInfo.clubDetails.cname}</p>}
          {/* Add more overview content here */}
        </section>

        {/* You would create separate components for Events, Members, Settings */}
        {/* and render them based on the current route using nested routes */}
        {/* For example: */}
        {/* <Routes> */}
        {/* <Route path="/overview" element={<ClubOverview />} /> */}
        {/* <Route path="/events" element={<ClubEvents />} /> */}
        {/* <Route path="/members" element={<ClubMembers />} /> */}
        {/* <Route path="/settings" element={<ClubSettings />} /> */}
        {/* </Routes> */}
        <p>Content for the selected menu item will appear here.</p>
      </main>
    </div>
  );
};

export default ClubDashboard;