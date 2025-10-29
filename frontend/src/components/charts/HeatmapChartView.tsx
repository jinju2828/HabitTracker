import React from 'react';
import {
  ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Legend, Bar
} from 'recharts';
import type { HabitLog } from '../../utils/types';

interface HeatmapChartViewProps {
  habitLogs?: HabitLog[];
}

export const HeatmapChartView: React.FC<HeatmapChartViewProps> = ({ habitLogs = [] }) => {
  const data = habitLogs.map(log => ({
    date: log.log_date.slice(0, 10),
    completed: log.completed ? 1 : 0,
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3>🔥 Heatmap Chart View</h3>
      <ResponsiveContainer>
        <ComposedChart data={data}>
          <XAxis dataKey="date" />
          <YAxis domain={[0, 1]} ticks={[0, 1]} />
          <Tooltip formatter={(val: number) => val === 1 ? 'Completed' : 'Not done'} />
          <Legend />
          <Bar dataKey="completed" fill="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
