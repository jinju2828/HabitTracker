import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import type { HabitLog } from './../../utils/types';

interface LineDotChartViewProps {
  habitLogs?: HabitLog[];
}

export const LineDotChartView: React.FC<LineDotChartViewProps> = ({ habitLogs = [] }) => {
  const data = habitLogs.map(log => ({
    date: log.log_date.slice(0, 10),
    completed: log.completed ? 1 : 0,
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
          <YAxis domain={[0, 1]} ticks={[0, 1]} tickFormatter={v => v === 1 ? '✅' : '❌'} />
          <Tooltip formatter={(val: number) => val === 1 ? 'Completed' : 'Not done'} />
          <Legend />
          <Line type="monotone" dataKey="completed" stroke="#8884d8" dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
