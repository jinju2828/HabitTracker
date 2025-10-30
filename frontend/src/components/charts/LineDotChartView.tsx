import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartPoint } from '../../utils/types';

interface Props {
  chartData: ChartPoint[];
}

export const LineDotChartView: React.FC<Props> = ({ chartData }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis ticks={[0, 1]} tickFormatter={(val) => (val === 1 ? '✅' : '❌')} />
      <Tooltip formatter={(val: number) => (val === 1 ? 'Completed' : 'Not done')} />
      <Line type="monotone" dataKey="completed" stroke="#8884d8" />
    </LineChart>
  </ResponsiveContainer>
);
