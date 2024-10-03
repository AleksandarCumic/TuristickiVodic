import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [active, setActive] = useState(localStorage.getItem('active'));
    const [username, setUsername] = useState(localStorage.getItem('user'));

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'));

        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem('token'));
            setActive(localStorage.getItem('active'));
            setUsername(localStorage.getItem('user'));
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('active');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        navigate('/login');
    };

    const role = localStorage.getItem('role');

    return (
        <nav style={styles.navbar}>
            <ul style={styles.navList}>
                <li style={styles.navItem}><Link to="/home" style={styles.navLink}>Home</Link></li>
                <li style={styles.navItem}><Link to="/most-read" style={styles.navLink}>Most Read</Link></li>
                <li style={styles.navItem}><Link to="/all-destinations" style={styles.navLink}>Destinations</Link></li>

                {isLoggedIn && (
                    <>
                        {role === 'admin' && (
                            <>
                                <li style={styles.navItem}><Link to="/manage-destinations" style={styles.navLink}>Manage Destinations</Link></li>
                                <li style={styles.navItem}><Link to="/articles" style={styles.navLink}>Articles</Link></li>
                                <li style={styles.navItem}><Link to="/users" style={styles.navLink}>Users</Link></li>
                            </>
                        )}
                        {role === 'editor' && active === 'true' && (
                            <>
                                <li style={styles.navItem}><Link to="/manage-destinations" style={styles.navLink}>Manage Destinations</Link></li>
                                <li style={styles.navItem}><Link to="/articles" style={styles.navLink}>Articles</Link></li>
                            </>
                        )}
                    </>
                )}

                <div style={styles.rightSection}>
                    {isLoggedIn && (
                        <li style={styles.navItem}>
                            <span style={styles.username}>{username}</span>
                        </li>
                    )}
                    {isLoggedIn ? (
                        <li style={styles.navItem}><button onClick={handleLogout} style={styles.logoutButton}>Logout</button></li>
                    ) : (
                        <li style={styles.navItem}><Link to="/login" style={styles.navLink}>Login</Link></li>
                    )}
                </div>
            </ul>
        </nav>
    );
};

const styles = {
    navbar: {
        backgroundColor: '#333',
        padding: '10px 20px',
    },
    navList: {
        listStyleType: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    navItem: {
        margin: '0 10px',
    },
    navLink: {
        color: '#fff',
        textDecoration: 'none',
    },
    rightSection: {
        display: 'flex',
        alignItems: 'center',
    },
    username: {
        color: '#fff',
        marginRight: '20px',
    },
    logoutButton: {
        backgroundColor: '#f44336',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        cursor: 'pointer',
    },
};

export default Navbar;
