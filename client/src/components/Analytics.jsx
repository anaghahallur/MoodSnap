import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './Analytics.css';

const COLORS = {
    calm: '#00b894',    // Green
    happy: '#55efc4',   // Light Green
    sad: '#0984e3',     // Blue
    low: '#74b9ff',     // Light Blue
    stressed: '#d63031', // Red
    angry: '#ff7675',    // Pinkish Red
    anxious: '#fdcb6e',  // Yellow
    neutral: '#b2bec3'   // Gray
};

const Analytics = ({ data = [] }) => {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];

        const counts = data.reduce((acc, entry) => {
            const emotion = entry.emotion.toLowerCase();
            acc[emotion] = (acc[emotion] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
            color: COLORS[name] || COLORS.neutral
        }));
    }, [data]);

    if (!data || data.length === 0) return null;

    return (
        <div className="analytics-container glass-panel">
            <h3 className="analytics-title">Emotional Balance</h3>
            <div className="chart-wrapper" style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(25, 25, 25, 0.8)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                backdropFilter: 'blur(10px)'
                            }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Analytics;
