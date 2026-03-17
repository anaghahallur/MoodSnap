import React, { useState } from 'react';
import './GratitudeAmplifier.css';

const GratitudeAmplifier = () => {
    const [thought, setThought] = useState('');
    const [isAmplified, setIsAmplified] = useState(false);

    const amplify = () => {
        if (thought.trim()) {
            setIsAmplified(true);
        }
    };

    return (
        <div className="gratitude-amplifier">
            {!isAmplified ? (
                <div className="amplifier-setup">
                    <p className="amplifier-prompt">You're feeling great! What made this moment happen?</p>
                    <textarea
                        className="amplifier-input"
                        placeholder="Tell me more about this happy moment..."
                        value={thought}
                        onChange={(e) => setThought(e.target.value)}
                    />
                    <button className="amplify-btn" onClick={amplify} disabled={!thought.trim()}>
                        Share & Amplify
                    </button>
                </div>
            ) : (
                <div className="amplifier-result">
                    <div className="confetti-container">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="confetti-piece" style={{
                                left: Math.random() * 100 + '%',
                                backgroundColor: ['#55efc4', '#81ecec', '#74b9ff', '#a29bfe', '#fab1a0'][Math.floor(Math.random() * 5)],
                                animationDelay: Math.random() * 2 + 's',
                                animationDuration: Math.random() * 3 + 2 + 's'
                            }}></div>
                        ))}
                    </div>
                    <div className="result-content glass-panel">
                        <h3>That's wonderful! ✨</h3>
                        <p className="user-thought">"{thought}"</p>
                        <div className="amplification-tip">
                            <strong>Coach Tip:</strong> Joy is meant to be shared. Consider sending a quick text to someone involved, or simply take a deep breath to "save" this feeling for later.
                        </div>
                        <button className="reset-btn" onClick={() => setIsAmplified(false)}>Capture another moment</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GratitudeAmplifier;
