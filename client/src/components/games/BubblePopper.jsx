import React, { useState } from 'react';
import './BubblePopper.css';

const BubblePopper = () => {
    const [bubbles, setBubbles] = useState(Array(20).fill(false));
    const [isAllPopped, setIsAllPopped] = useState(false);

    const popBubble = (index) => {
        if (bubbles[index]) return;

        const newBubbles = [...bubbles];
        newBubbles[index] = true;
        setBubbles(newBubbles);

        // Simple haptic feedback if supported
        if (window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }

        if (newBubbles.every(b => b)) {
            setIsAllPopped(true);
        }
    };

    const reset = () => {
        setBubbles(Array(20).fill(false));
        setIsAllPopped(false);
    };

    return (
        <div className="bubble-popper-container">
            <div className="bubble-grid">
                {bubbles.map((popped, idx) => (
                    <div
                        key={idx}
                        className={`bubble-item ${popped ? 'popped' : ''}`}
                        onClick={() => popBubble(idx)}
                    >
                        <div className="bubble-inner"></div>
                    </div>
                ))}
            </div>

            {isAllPopped && (
                <div className="reset-overlay">
                    <p>All tension released!</p>
                    <button className="reset-btn" onClick={reset}>Refill Wrap</button>
                </div>
            )}

            <p className="popper-hint">Pop away the frustration. Focus on the sensation.</p>
        </div>
    );
};

export default BubblePopper;
