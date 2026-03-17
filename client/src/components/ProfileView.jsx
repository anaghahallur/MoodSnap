import React from 'react';
import './ProfileView.css';

const ProfileView = ({ heatmapData }) => {
    const totalEntries = heatmapData.length;
    const emotions = heatmapData.reduce((acc, curr) => {
        acc[curr.emotion] = (acc[curr.emotion] || 0) + 1;
        return acc;
    }, {});

    const topEmotion = Object.entries(emotions).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    return (
        <div className="profile-view glass-panel">
            <div className="profile-header">
                <div className="profile-avatar">👤</div>
                <div className="profile-info">
                    <h2>Your Mindful Profile</h2>
                    <p className="profile-stat-summary">You've tracked your mood {totalEntries} times.</p>
                </div>
            </div>

            <div className="profile-stats-grid">
                <div className="stat-card">
                    <span className="stat-value">{totalEntries}</span>
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
                    <button className="toggle-btn active">On</button>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
