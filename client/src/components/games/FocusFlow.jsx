import React, { useState, useEffect } from 'react';
import './FocusFlow.css';

const FocusFlow = () => {
    const [task, setTask] = useState('');
    const [isStarted, setIsStarted] = useState(false);
    const [seconds, setSeconds] = useState(300); // 5 minutes

    useEffect(() => {
        let timer;
        if (isStarted && seconds > 0) {
            timer = setInterval(() => {
                setSeconds(s => s - 1);
            }, 1000);
        } else if (seconds === 0) {
            setIsStarted(false);
        }
        return () => clearInterval(timer);
    }, [isStarted, seconds]);

    const formatTime = (s) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const startFocus = () => {
        if (task.trim()) {
            setIsStarted(true);
        }
    };

    return (
        <div className="focus-flow-container">
            {!isStarted ? (
                <div className="focus-setup">
                    <p className="focus-prompt">What is the ONE thing you need to do right now?</p>
                    <input
                        type="text"
                        className="focus-input"
                        placeholder="Just one small task..."
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && startFocus()}
                    />
                    <button className="focus-start-btn" onClick={startFocus} disabled={!task.trim()}>
                        Focus for 5 Minutes
                    </button>
                    <p className="focus-hint">Break the overwhelm by narrowing your world.</p>
                </div>
            ) : (
                <div className="focus-active">
                    <h2 className="active-task">"{task}"</h2>
                    <div className="focus-timer">{formatTime(seconds)}</div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(seconds / 300) * 100}%` }}></div>
                    </div>
                    <button className="focus-cancel-btn" onClick={() => setIsStarted(false)}>
                        Stop focusing
                    </button>
                </div>
            )}
        </div>
    );
};

export default FocusFlow;
