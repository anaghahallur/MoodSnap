import React, { useState, useEffect } from 'react';
import './CommunityMood.css';

const CommunityMood = ({ apiUrl }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCommunityMood = async () => {
            try {
                const response = await fetch(`${apiUrl}/community-mood`);
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (err) {
                console.error('Community Mood Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCommunityMood();
        const interval = setInterval(fetchCommunityMood, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [apiUrl]);

    if (loading || !stats || stats.total === 0) return null;

    return (
        <div className="community-mood-widget glass-panel animated">
            <div className="community-header">
                <div className="live-indicator">
                    <span className="dot"></span>
                    LIVE
                </div>
                <h4>Community Mood</h4>
            </div>

            <p className="community-intro">Right now, the world is feeling...</p>

            <div className="mood-bars">
                {stats.moods.map((mood) => (
                    <div key={mood.label} className="mood-bar-group">
                        <div className="mood-bar-info">
                            <span className="mood-bar-label">{mood.label}</span>
                            <span className="mood-bar-percent">{mood.percentage}%</span>
                        </div>
                        <div className="mood-bar-track">
                            <div
                                className="mood-bar-fill"
                                style={{ width: `${mood.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="community-footer">
                <span>{stats.total} entries in the last 24h</span>
            </div>
        </div>
    );
};

export default CommunityMood;
