import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './ProfileView.css';

const ProfileView = ({ user, heatmapData, theme, onToggleTheme, onLogout }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(user?.user_metadata?.full_name || '');
    const [isSaving, setIsSaving] = useState(false);

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User Account';

    const handleSaveName = async () => {
        if (!newName.trim()) {
            setIsEditing(false);
            return;
        }
        setIsSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: newName.trim() }
            });
            if (error) throw error;
            setIsEditing(false);
        } catch (err) {
            console.error('Error updating name:', err);
        } finally {
            setIsSaving(false);
        }
    };

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
                        {displayName[0].toUpperCase()}
                    </div>
                    <div className="profile-name-section">
                        {isEditing ? (
                            <div className="name-edit-group">
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="name-edit-input"
                                    placeholder="Enter your name"
                                    disabled={isSaving}
                                    autoFocus
                                />
                                <button className="name-save-btn" onClick={handleSaveName} disabled={isSaving}>
                                    {isSaving ? '...' : 'Save'}
                                </button>
                                <button className="name-cancel-btn" onClick={() => setIsEditing(false)} disabled={isSaving}>
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <div className="name-display-group">
                                <h2>{displayName}</h2>
                                <button className="name-edit-icon" onClick={() => setIsEditing(true)}>✎</button>
                            </div>
                        )}
                        <p className="profile-since">Member since {new Date(user?.created_at).toLocaleDateString()}</p>
                    </div>
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
