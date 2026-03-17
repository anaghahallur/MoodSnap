import React, { useState, useEffect } from 'react';
import './StretchGuide.css';

const STRETCHES = [
    {
        title: "Neck Rolls",
        instruction: "Gently roll your neck in a slow circle. Switch directions halfway.",
        duration: 15,
        icon: (
            <svg viewBox="0 0 100 100" className="stretch-svg">
                <circle cx="50" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M50 40 L50 70 M30 50 L70 50 M40 90 L50 70 L60 90" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M40 20 A15 15 0 1 1 60 20" fill="none" stroke="currentColor" strokeWidth="2" className="animate-rotate" />
            </svg>
        )
    },
    {
        title: "Shoulder Shrugs",
        instruction: "Lift your shoulders to your ears, hold for a second, then drop them firmly.",
        duration: 15,
        icon: (
            <svg viewBox="0 0 100 100" className="stretch-svg">
                <circle cx="50" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M50 40 L50 70 M30 50 L70 50 M40 90 L50 70 L60 90" fill="none" stroke="currentColor" strokeWidth="2" className="animate-shrug" />
            </svg>
        )
    },
    {
        title: "Seated Twist",
        instruction: "Place your right hand on your left knee and gently twist your torso to the left.",
        duration: 15,
        icon: (
            <svg viewBox="0 0 100 100" className="stretch-svg">
                <circle cx="50" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M50 40 L50 70 M35 45 L65 55 M40 90 L50 70 L60 90" fill="none" stroke="currentColor" strokeWidth="2" className="animate-twist" />
            </svg>
        )
    }
];

const StretchGuide = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [seconds, setSeconds] = useState(STRETCHES[0].duration);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        let timer;
        if (isActive && seconds > 0) {
            timer = setInterval(() => setSeconds(s => s - 1), 1000);
        } else if (seconds === 0) {
            if (currentIndex < STRETCHES.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setSeconds(STRETCHES[currentIndex + 1].duration);
            } else {
                setIsFinished(true);
                setIsActive(false);
            }
        }
        return () => clearInterval(timer);
    }, [isActive, seconds, currentIndex]);

    const start = () => {
        setIsActive(true);
        setIsFinished(false);
    };

    const reset = () => {
        setCurrentIndex(0);
        setSeconds(STRETCHES[0].duration);
        setIsActive(false);
        setIsFinished(false);
    };

    const currentStretch = STRETCHES[currentIndex];

    return (
        <div className="stretch-guide">
            {!isActive && !isFinished ? (
                <div className="stretch-intro">
                    <p>Feeling a bit low on energy? Let's do 3 gentle desk stretches together. It only takes 45 seconds.</p>
                    <button className="stretch-start-btn" onClick={start}>Start Stretching</button>
                </div>
            ) : isFinished ? (
                <div className="stretch-finished">
                    <div className="finish-icon">🌱</div>
                    <h3>Great job!</h3>
                    <p>Hopefully, you feel a little more refreshed. Take a deep breath and go at your own pace today.</p>
                    <button className="stretch-reset-btn" onClick={reset}>Go again</button>
                </div>
            ) : (
                <div className="stretch-active">
                    <div className="stretch-icon-container">
                        {currentStretch.icon}
                    </div>
                    <div className="stretch-info">
                        <h3>{currentStretch.title}</h3>
                        <p>{currentStretch.instruction}</p>
                    </div>
                    <div className="stretch-timer">
                        <svg viewBox="0 0 36 36" className="timer-svg">
                            <path className="timer-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="timer-fill" style={{ strokeDasharray: `${(seconds / currentStretch.duration) * 100}, 100` }} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <text x="18" y="20.35" className="timer-text">{seconds}</text>
                        </svg>
                    </div>
                    <p className="stretch-progress">Step {currentIndex + 1} of 3</p>
                </div>
            )}
        </div>
    );
};

export default StretchGuide;
