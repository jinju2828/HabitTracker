import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import type { ChartPoint } from '../../utils/types';

interface BarChartViewProps {
  chartData: ChartPoint[];
}

export const BarChartView: React.FC<BarChartViewProps> = ({ chartData }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3>📦 Bar Chart View</h3>
      <ResponsiveContainer>
        <BarChart data={chartData}>
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
