import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from './ClubSidebar.module.css';
import { FaHome, FaCalendarAlt, FaUserPlus, FaUsers, FaUser, FaCog, FaSyncAlt, FaSignOutAlt } from 'react-icons/fa'; // Import FaSignOutAlt

const ClubSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/clubs/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
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
        { path: '/club/overview', label: 'Overview', icon: <FaHome className={styles.sidebarNavItemIcon} /> },
        { path: '/club/events', label: 'Events', icon: <FaCalendarAlt className={styles.sidebarNavItemIcon} /> },
        { path: '/club/recruitments', label: 'Recruitments', icon: <FaUserPlus className={styles.sidebarNavItemIcon} /> },
        { path: '/club/members', label: 'Members', icon: <FaUsers className={styles.sidebarNavItemIcon} /> },
        { path: '/club/profile', label: 'Profile', icon: <FaUser className={styles.sidebarNavItemIcon} /> },
        { path: '/club/settings', label: 'Settings', icon: <FaCog className={styles.sidebarNavItemIcon} /> },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarLogo}>
                <FaSyncAlt className={styles.sidebarLogoIcon} />
                <span className={styles.sidebarLogoText}>ClubSync</span>
            </div>
            <div className={styles.sidebarNav}>
                <div className={styles.adminTools}>Club Menu</div>
                <nav>
                    {menuItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `${styles.sidebarNavItem} ${isActive ? styles.sidebarNavItemActive : ''}`
                            }
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>
            
            <div className={styles.sidebarSupport}>
                <p className={styles.sidebarSupportText}>Have any problems with managing your dashboard? Contact our support.</p>
                <button className={styles.sidebarSupportButton}>Contact Us</button>
            </div>
            <button onClick={handleLogout} className={styles.logoutButtonSidebar}>
                <FaSignOutAlt className={styles.logoutButtonSidebarIcon} />
                Logout
            </button>
        </aside>
    );
};

export default ClubSidebar;