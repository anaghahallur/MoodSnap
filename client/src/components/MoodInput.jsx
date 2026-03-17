import React, { useState } from 'react';
import './MoodInput.css';

const MoodInput = ({ onSubmit, isSubmitting }) => {
    const [text, setText] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (text.trim() && !isSubmitting) {
                onSubmit(text);
                setText('');
            }
        }
    };

    const handleInput = (e) => {
        setText(e.target.value);
        // Auto-resize textarea
        e.target.style.height = 'auto';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
    };

    return (
        <div className="mood-input-container glass-panel">
            <textarea
                className="mood-textarea"
                placeholder="How are you feeling right now?"
                value={text}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                disabled={isSubmitting}
                rows={1}
            />
            <div className="input-footer">
                <span className="helper-text">Press Enter to submit</span>
                <button
                    className={`submit-btn ${text.trim() ? 'active' : ''} ${isSubmitting ? 'loading' : ''}`}
                    onClick={() => {
                        if (text.trim() && !isSubmitting) {
                            onSubmit(text);
                            setText('');
                        }
                    }}
                    disabled={!text.trim() || isSubmitting}
                >
                    {isSubmitting ? (
                        <div className="spinner"></div>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default MoodInput;
