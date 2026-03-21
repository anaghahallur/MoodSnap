import React, { useState } from 'react';
import './GroundingGame.css';

const GroundingGame = () => {
    const [step, setStep] = useState(0);
    const [inputs, setInputs] = useState({
        see: ['', '', '', '', ''],
        hear: ['', '', '', ''],
        touch: ['', '', ''],
        smell: ['', ''],
        taste: ['']
    });
    const [isFinished, setIsFinished] = useState(false);

    const steps = [
        { key: 'see', count: 5, label: 'Things you can SEE', instruction: 'Look around you. Name 5 things that catch your eye.' },
        { key: 'hear', count: 4, label: 'Things you can HEAR', instruction: 'Close your eyes for a moment. What are 4 sounds you can distinguish?' },
        { key: 'touch', count: 3, label: 'Things you can TOUCH', instruction: 'Focus on your body. Name 3 textures or temperatures you can feel.' },
        { key: 'smell', count: 2, label: 'Things you can SMELL', instruction: 'Breathe in deeply. Can you notice 2 different scents in the air?' },
        { key: 'taste', count: 1, label: 'Thing you can TASTE', instruction: 'What is 1 thing you can taste? Even a lingering flavor or just the air.' }
    ];

    const currentStepData = steps[step];

    const handleInputChange = (index, value) => {
        const newInputs = { ...inputs };
        newInputs[currentStepData.key][index] = value;
        setInputs(newInputs);
    };

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            setIsFinished(true);
        }
    };

    const isStepComplete = inputs[currentStepData.key].every(val => val.trim() !== '');

    if (isFinished) {
        return (
            <div className="grounding-finished">
                <div className="check-icon">✓</div>
                <h3>You are grounded.</h3>
                <p>By focusing on your senses, you've brought your awareness back to the present moment. Take one last deep breath.</p>
                <div className="summary-list">
                    {steps.map(s => (
                        <div key={s.key} className="summary-item">
                            <strong>{s.count} {s.key}:</strong> {inputs[s.key].join(', ')}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="grounding-game">
            <div className="step-progress">
                {steps.map((_, i) => (
                    <div key={i} className={`progress-dot ${i <= step ? 'active' : ''} ${i === step ? 'current' : ''}`}></div>
                ))}
            </div>

            <div className="grounding-content">
                <h4 className="grounding-step-title">{currentStepData.label}</h4>
                <p className="grounding-instruction">{currentStepData.instruction}</p>

                <div className="grounding-inputs">
                    {inputs[currentStepData.key].map((val, idx) => (
                        <input
                            key={idx}
                            type="text"
                            placeholder={`${idx + 1}...`}
                            value={val}
                            onChange={(e) => handleInputChange(idx, e.target.value)}
                            className="grounding-input"
                        />
                    ))}
                </div>

                <div className="grounding-actions">
                    <button
                        className={`grounding-next-btn ${isStepComplete ? 'enabled' : ''}`}
                        onClick={handleNext}
                        disabled={!isStepComplete}
                    >
                        {step === steps.length - 1 ? 'Finish' : 'Next'}
                    </button>
                    {step > 0 && (
                        <button className="grounding-back-link" onClick={() => setStep(step - 1)}>
                            Go back
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroundingGame;
