import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import type { HabitLog } from '../../utils/types';

interface BarChartViewProps {
  habitLogs?: HabitLog[];
}

export const BarChartView: React.FC<BarChartViewProps> = ({ habitLogs = [] }) => {
  const data = habitLogs.map(log => ({
    date: log.log_date.slice(0, 10),
    completed: log.completed ? 1 : 0,
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3>📦 Bar Chart View</h3>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 1]} ticks={[0, 1]} tickFormatter={v => v === 1 ? '✅' : '❌'} />
          <Tooltip formatter={(val: number) => val === 1 ? 'Completed' : 'Not done'} />
          <Legend />
          <Bar dataKey="completed" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
