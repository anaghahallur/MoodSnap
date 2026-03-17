import React from 'react';
import './Navbar.css';

const Navbar = ({ currentView, onViewChange }) => {
    return (
        <nav className="navbar glass-panel">
            <div className="nav-left">
                <div className="nav-logo" onClick={() => onViewChange('home')}>
                    <span className="logo-emoji">📸</span>
                    <span className="logo-text">MoodSnap</span>
                </div>
            </div>

            <div className="nav-center">
                <button
                    className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
                    onClick={() => onViewChange('home')}
                >
                    Home
                </button>
                <button
                    className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
                    onClick={() => onViewChange('dashboard')}
                >
                    Dashboard
                </button>
            </div>

            <div className="nav-right">
                <button
                    className={`nav-profile ${currentView === 'profile' ? 'active' : ''}`}
                    onClick={() => onViewChange('profile')}
                >
                    <div className="profile-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span>Profile</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
