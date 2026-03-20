import React, { useState, useEffect } from 'react';
import './WeeklySummary.css';

const WeeklySummary = ({ apiUrl, session }) => {
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            if (!session) return;
            try {
                const response = await fetch(`${apiUrl}/summary`, {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`
                    }
                });
                const data = await response.json();
                setSummary(data.summary);
            } catch (err) {
                console.error('Error fetching summary:', err);
                setSummary('Unable to generate your summary right now. Keep tracking!');
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [apiUrl, session]); // Dependencies are correct: apiUrl and session are external props that fetchSummary depends on.

    if (loading) return null; // Don't show anything while loading to keep the UI clean

    return (
        <div className="weekly-summary glass-panel">
            <div className="summary-header">
                <span className="summary-icon">✨</span>
                <h3>Weekly Reflection</h3>
            </div>
            <p className="summary-text">{summary}</p>
        </div>
    );
};

export default WeeklySummary;
