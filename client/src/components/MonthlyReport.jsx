import React, { useState, useEffect } from 'react';
import './MonthlyReport.css';

const MonthlyReport = ({ apiUrl, session }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            if (!session) return;
            try {
                const response = await fetch(`${apiUrl}/monthly-report`, {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch monthly stats');
                const data = await response.json();
                setStats(data.stats);
            } catch (err) {
                console.error('Monthly Report Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [apiUrl, session]);

    if (loading) return (
        <div className="monthly-report-card loading glass-panel">
            <div className="skeleton-circle"></div>
            <div className="skeleton-line"></div>
        </div>
    );

    if (error || !stats) return null;

    return (
        <div className="monthly-report-card glass-panel animated" id="monthly-report-capture">
            <div className="report-header">
                <div className="report-title-group">
                    <span className="report-subtitle">Monthly Review</span>
                    <h3 className="report-month">{stats.month}</h3>
                </div>
                <div className="report-logo">MoodSnap</div>
            </div>

            <div className="report-main-stat">
                <div className="stat-circle">
                    <span className="stat-value">{stats.totalEntries}</span>
                    <span className="stat-label">Total Logs</span>
                </div>
                <div className="top-mood-highlight">
                    <span className="highlight-label">Dominant Vibe</span>
                    <span className="highlight-value">{stats.topMood}</span>
                </div>
            </div>

            <div className="report-details-grid">
                <div className="detail-item">
                    <span className="detail-label">Happiest Day</span>
                    <span className="detail-value">{stats.happiestDay}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Consistency</span>
                    <span className="detail-value">
                        {Math.round((stats.totalEntries / (new Date().getDate())) * 100)}%
                    </span>
                </div>
            </div>

            <div className="mood-breakdown">
                <h4>Mood Breakdown</h4>
                <div className="mood-tags">
                    {Object.entries(stats.moodCounts).map(([mood, count]) => (
                        <div key={mood} className="mood-tag">
                            <span className="mood-name">{mood}</span>
                            <span className="mood-count">{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="report-footer">
                <p>Your journey is valid. Every entry is progress.</p>
                <div className="report-actions">
                    <button className="share-btn" onClick={() => window.print()}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Save Card
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MonthlyReport;
