import React, { useState, useEffect } from 'react';
import './PatternInsight.css';

const PatternInsight = ({ apiUrl, session }) => {
    const [insight, setInsight] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPattern = async () => {
            if (!session) return;
            setLoading(true);
            try {
                const response = await fetch(`${apiUrl}/patterns`, {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch patterns');
                const data = await response.json();
                setInsight(data.pattern);
            } catch (err) {
                console.error('Pattern Insight Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPattern();
    }, [apiUrl, session]);

    if (loading) return (
        <div className="pattern-insight-card loading glass-panel">
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
        </div>
    );

    if (error) return null;

    return (
        <div className="pattern-insight-card glass-panel animated">
            <div className="insight-header">
                <span className="insight-icon">🔍</span>
                <h4>Pattern Detection</h4>
            </div>
            <div className="insight-content">
                <p className="insight-text">{insight}</p>
            </div>
            <div className="insight-footer">
                <span className="insight-badge">New Insight</span>
                <span className="insight-meta">Based on last 7 entries</span>
            </div>
        </div>
    );
};

export default PatternInsight;
