import React, { useState } from 'react';
import './GratitudeJar.css';

const GratitudeJar = () => {
    const [notes, setNotes] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const addNote = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            const newNote = {
                id: Date.now(),
                text: inputValue,
                rotate: Math.random() * 20 - 10 + 'deg',
                left: Math.random() * 60 + 20 + '%',
                top: Math.random() * 40 + 30 + '%'
            };
            setNotes([...notes, newNote]);
            setInputValue('');
        }
    };

    return (
        <div className="gratitude-jar-container">
            <div className="jar-visual">
                <div className="jar-outline"></div>
                <div className="jar-lid"></div>
                <div className="notes-layer">
                    {notes.map(note => (
                        <div
                            key={note.id}
                            className="jar-note"
                            style={{
                                transform: `rotate(${note.rotate})`,
                                left: note.left,
                                top: note.top
                            }}
                        >
                            {note.text}
                        </div>
                    ))}
                </div>
            </div>

            <div className="jar-input-group">
                <p className="jar-prompt">What's one small good thing from today?</p>
                <input
                    type="text"
                    className="jar-input"
                    placeholder="Type and press Enter..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={addNote}
                    disabled={notes.length >= 5}
                />
                <span className="jar-count">{notes.length}/5 notes collected</span>
            </div>
        </div>
    );
};

export default GratitudeJar;
