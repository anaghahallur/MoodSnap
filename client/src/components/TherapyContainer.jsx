import React, { useState } from 'react';
import './TherapyContainer.css';

// Lazy load or import games
import BubbleBreathing from './games/BubbleBreathing';
import SandDrawing from './games/SandDrawing';
import GratitudeJar from './games/GratitudeJar';
import BubblePopper from './games/BubblePopper';
import FocusFlow from './games/FocusFlow';
import GratitudeAmplifier from './games/GratitudeAmplifier';
import StretchGuide from './games/StretchGuide';

const TherapyContainer = ({ emotion }) => {
    const [isOpen, setIsOpen] = useState(false);

    const getGameComponent = () => {
        const emo = emotion.toLowerCase();

        switch (true) {
            case emo.includes('anxious') || emo.includes('anxiety') || emo.includes('worry') || emo.includes('panick'):
                return {
                    component: <BubbleBreathing />,
                    title: 'Calm Breathing',
                    subtitle: 'Pop circles in rhythm with your breath.'
                };
            case emo.includes('stress') || emo.includes('frustrat') || emo.includes('overwork') || emo.includes('burnt'):
                return {
                    component: <SandDrawing />,
                    title: 'Sand Expression',
                    subtitle: 'Draw freely with glowing sand.'
                };
            case emo.includes('sad') || emo.includes('lonely') || emo.includes('down') || emo.includes('depress') || emo.includes('grief'):
                return {
                    component: <GratitudeJar />,
                    title: 'Gratitude Jar',
                    subtitle: 'Note down 3 small good things.'
                };
            case emo.includes('angr') || emo.includes('annoy') || emo.includes('mad') || emo.includes('rage'):
                return {
                    component: <BubblePopper />,
                    title: 'Pressure Release',
                    subtitle: 'Satisfying bubble wrap popping.'
                };
            case emo.includes('overwhelmed') || emo.includes('confus') || emo.includes('paralyz'):
                return {
                    component: <FocusFlow />,
                    title: 'One Thing Focus',
                    subtitle: 'Clear the noise. Focus on one task.'
                };
            case emo.includes('happ') || emo.includes('excit') || emo.includes('joy') || emo.includes('great') || emo.includes('euphor'):
                return {
                    component: <GratitudeAmplifier />,
                    title: 'Joy Amplifier',
                    subtitle: 'Celebrate and extend this feeling.'
                };
            case emo.includes('tire') || emo.includes('exhaust') || emo.includes('low energy') || emo.includes('laz') || emo.includes('sleepy'):
                return {
                    component: <StretchGuide />,
                    title: 'Gentle Movement',
                    subtitle: '3 simple desk stretches.'
                };
            default:
                return null;
        }
    };

    const game = getGameComponent();

    if (!game) return null;

    return (
        <div className="therapy-container">
            {!isOpen ? (
                <button className="open-therapy-btn glass-panel" onClick={() => setIsOpen(true)}>
                    <span className="sparkle-icon">✨</span>
                    <div className="btn-text">
                        <span className="btn-title">Try a quick relief activity</span>
                        <span className="btn-subtitle">{game.title}: {game.subtitle}</span>
                    </div>
                </button>
            ) : (
                <div className="therapy-modal glass-panel">
                    <div className="therapy-modal-header">
                        <div className="therapy-title-group">
                            <h3>{game.title}</h3>
                            <p>{game.subtitle}</p>
                        </div>
                        <button className="close-modal-btn" onClick={() => setIsOpen(false)}>&times;</button>
                    </div>
                    <div className="therapy-game-content">
                        {game.component}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TherapyContainer;
