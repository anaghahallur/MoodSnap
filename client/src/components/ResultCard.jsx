import React, { useEffect, useState } from 'react';
import './ResultCard.css';
import TherapyContainer from './TherapyContainer';

const ResultCard = ({ result, show }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let timer;
        if (show && result) {
            // Small delay to allow the DOM to render before triggering the animation class
            timer = setTimeout(() => setIsVisible(true), 50);
        } else {
            setIsVisible(false);
        }
        return () => clearTimeout(timer);
    }, [show, result]);

    if (!show || !result) return null;

    return (
        <div className={`result-card-container glass-panel ${isVisible ? 'visible' : ''}`}>
            <div className="emotion-header">
                <span className="emotion-emoji">{result.emoji}</span>
                <div className="emotion-text-container">
                    <span className="emotion-label-prefix">You're feeling</span>
                    <h2 className="emotion-label">{result.emotion}</h2>
                </div>
            </div>

            <div className="divider"></div>

            <div className="result-body">
                <p className="empathetic-message">"{result.message}"</p>

                <div className="tip-container">
                    <div className="tip-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="tip-content">
                        <span className="tip-label">Try this right now:</span>
                        <p className="tip-text">{result.tip}</p>
                    </div>
                </div>

                <TherapyContainer emotion={result.emotion} />
            </div>
        </div>
    );
};

export default ResultCard;
