import React from 'react';
import './HeatMap.css';

// Pre-defined color mapping for different emotional states
const emotionColors = {
    calm: 'var(--success-color)',    // Green
    happy: 'var(--success-color)',   // Green
    sad: 'var(--info-color)',        // Blue
    low: 'var(--info-color)',        // Blue
    stressed: 'var(--danger-color)', // Red
    angry: 'var(--danger-color)',    // Red
    anxious: 'var(--warning-color)', // Yellow
    neutral: 'var(--glass-border)',  // Gray/Neutral
    empty: 'transparent'             // No data
};

const HeatMap = ({ data = [], onSelectEntry }) => {
    // Generate the last 7 days array
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        return d;
    });

    // Map provided data to the days, or use empty/neutral
    const daysData = last7Days.map(date => {
        // Robust local YYYY-MM-DD string
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        // Find the record for this date in the raw data
        const dayRecord = data.find(d => {
            const entryDateObj = new Date(d.created_at);
            const entryDateStr = `${entryDateObj.getFullYear()}-${String(entryDateObj.getMonth() + 1).padStart(2, '0')}-${String(entryDateObj.getDate()).padStart(2, '0')}`;
            return entryDateStr === dateStr;
        });

        return {
            date,
            dayName: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()],
            record: dayRecord,
            emotion: dayRecord ? dayRecord.emotion : 'empty',
            label: dayRecord ? dayRecord.emotion : 'No entry'
        };
    });

    return (
        <div className="heatmap-container glass-panel">
            <div className="heatmap-header">
                <h3 className="heatmap-title">Your Week</h3>
                <span className="heatmap-subtitle">Past 7 days • Click to view diary</span>
            </div>

            <div className="heatmap-grid">
                {daysData.map((day, idx) => (
                    <div key={idx} className="heatmap-day-container">
                        <div
                            className={`heatmap-cell ${day.emotion !== 'empty' ? 'has-data clickable' : ''}`}
                            onClick={() => day.record && onSelectEntry(day.record)}
                            style={{
                                backgroundColor: emotionColors[day.emotion] || emotionColors.neutral,
                                animationDelay: `${idx * 0.1}s`,
                                cursor: day.record ? 'pointer' : 'default'
                            }}
                            title={day.record ? `View ${day.dayName}: ${day.label}` : 'No entry'}
                        >
                            {day.emotion !== 'empty' && (
                                <div className="cell-glow" style={{ background: emotionColors[day.emotion] }}></div>
                            )}
                        </div>
                        <span className="day-label">{day.dayName}</span>

                        {/* Custom Tooltip */}
                        <div className="day-tooltip">
                            <span className="tooltip-date">
                                {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                            <span className="tooltip-emotion">{day.record ? day.label : 'No entry'}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="heatmap-legend">
                <div className="legend-item"><span className="legend-color" style={{ background: emotionColors.calm }}></span> Good</div>
                <div className="legend-item"><span className="legend-color" style={{ background: emotionColors.anxious }}></span> Anxious</div>
                <div className="legend-item"><span className="legend-color" style={{ background: emotionColors.sad }}></span> Low</div>
                <div className="legend-item"><span className="legend-color" style={{ background: emotionColors.stressed }}></span> Hard</div>
            </div>
        </div>
    );
};

export default HeatMap;
