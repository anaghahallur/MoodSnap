import React from 'react';
import './ProfileView.css';

const ProfileView = ({ user, heatmapData, theme, onToggleTheme, onLogout }) => {
    const totalEntries = heatmapData.length;
    const emotions = heatmapData.reduce((acc, curr) => {
        acc[curr.emotion] = (acc[curr.emotion] || 0) + 1;
        return acc;
    }, {});

    const topEmotion = Object.entries(emotions).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    // Placeholder for streak calculation, as it's not provided in the snippet
    const calculateStreak = (data) => "7 Days"; // Or implement actual logic

    const stats = {
        totalEntries: totalEntries,
        topMood: topEmotion,
        streak: calculateStreak(heatmapData)
    };

    return (
        <div className="profile-container">
            <div className="profile-card glass-panel">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user?.email?.[0].toUpperCase() || '👤'}
                    </div>
                    <h2>{user?.email || 'User Account'}</h2>
                    <p className="profile-since">Member since {new Date(user?.created_at).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="profile-stats-grid">
                <div className="stat-card">
                    <span className="stat-value">{stats.totalEntries}</span>
                    <span className="stat-label">Entries</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{topEmotion}</span>
                    <span className="stat-label">Top Mood</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">7 Days</span>
                    <span className="stat-label">Streak</span>
                </div>
            </div>

            <div className="profile-settings glass-panel">
                <h3>Settings</h3>
                <div className="setting-item">
                    <span>Daily Reminders</span>
                    <button className="toggle-btn disabled">Off</button>
                </div>
                <div className="setting-item">
                    <span>Dark Mode</span>
                    <button
                        className={`toggle-btn ${theme === 'dark' ? 'active' : ''}`}
                        onClick={onToggleTheme}
                    >
                        {theme === 'dark' ? 'On' : 'Off'}
                    </button>
                </div>
                <div className="setting-item logout-section">
                    <button className="logout-btn" onClick={onLogout}>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
