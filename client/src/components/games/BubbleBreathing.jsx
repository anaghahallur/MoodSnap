import React, { useState, useEffect, useRef } from 'react';
import './BubbleBreathing.css';

const BubbleBreathing = () => {
    const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale, Pause
    const [seconds, setSeconds] = useState(4);
    const [bubbles, setBubbles] = useState([]);
    const bubbleIdRef = useRef(0);

    // Breathing Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    // Transition phase
                    setPhase((currentPhase) => {
                        switch (currentPhase) {
                            case 'Inhale': return 'Hold';
                            case 'Hold': return 'Exhale';
                            case 'Exhale': return 'Pause';
                            case 'Pause': return 'Inhale';
                            default: return 'Inhale';
                        }
                    });
                    return 4;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Bubble Generation Logic
    useEffect(() => {
        const interval = setInterval(() => {
            if (bubbles.length < 15) {
                const newBubble = {
                    id: bubbleIdRef.current++,
                    left: Math.random() * 90 + '%',
                    size: Math.random() * 30 + 20 + 'px',
                    duration: Math.random() * 3 + 4 + 's',
                    delay: Math.random() * 2 + 's'
                };
                setBubbles(prev => [...prev, newBubble]);
            }
        }, 800);

        return () => clearInterval(interval);
    }, [bubbles]);

    const popBubble = (id) => {
        setBubbles(prev => prev.filter(b => b.id !== id));
    };

    return (
        <div className="bubble-breathing">
            <div className="instruction-box">
                <h4 className={`phase-text ${phase.toLowerCase()}`}>{phase}</h4>
                <span className="seconds-text">{seconds}s</span>
            </div>

            <div className={`breathing-circle ${phase.toLowerCase()}`}>
                <div className="inner-glow"></div>
            </div>

            <div className="bubbles-container">
                {bubbles.map((bubble) => (
                    <div
                        key={bubble.id}
                        className="floating-bubble"
                        onClick={() => popBubble(bubble.id)}
                        onAnimationEnd={() => popBubble(bubble.id)}
                        style={{
                            left: bubble.left,
                            width: bubble.size,
                            height: bubble.size,
                            animationDuration: bubble.duration,
                            animationDelay: bubble.delay
                        }}
                    ></div>
                ))}
            </div>

            <p className="game-hint">Tap the bubbles to release tension</p>
        </div>
    );
};

export default BubbleBreathing;
