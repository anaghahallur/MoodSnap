import React, { useState, useEffect } from 'react';
import './IntentionSetter.css';

const IntentionSetter = ({ apiUrl, session }) => {
    const [intention, setIntention] = useState('');
    const [savedIntention, setSavedIntention] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTodayIntention = async () => {
            if (!session) return;
            try {
                const response = await fetch(`${apiUrl}/intentions/today`, {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setSavedIntention(data.intention);
                }
            } catch (err) {
                console.error('Fetch Intention Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTodayIntention();
    }, [apiUrl, session]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!intention.trim() || !session) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(`${apiUrl}/intentions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ intention })
            });

            if (response.ok) {
                setSavedIntention(intention);
            }
        } catch (err) {
            console.error('Submit Intention Error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return null;

    if (savedIntention) {
        return (
            <div className="intention-display glass-panel animated">
                <span className="intention-icon">☀️</span>
                <p>Today's Intention: <strong>{savedIntention}</strong></p>
            </div>
        );
    }

    return (
        <div className="intention-setter-container glass-panel animated">
            <form onSubmit={handleSubmit} className="intention-form">
                <div className="intention-input-group">
                    <span className="intention-prompt">Setting an intention for today?</span>
                    <input
                        type="text"
                        placeholder="e.g., Stay calm, be productive, choose joy..."
                        value={intention}
                        onChange={(e) => setIntention(e.target.value)}
                        disabled={isSubmitting}
                        className="intention-input"
                        maxLength={60}
                    />
                </div>
                <button type="submit" className="intention-submit-btn" disabled={isSubmitting || !intention.trim()}>
                    {isSubmitting ? '...' : 'Set'}
                </button>
            </form>
        </div>
    );
};

export default IntentionSetter;
