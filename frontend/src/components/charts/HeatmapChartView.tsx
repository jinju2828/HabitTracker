// HeatmapChartView.tsx
import React from 'react';
import type { ChartPoint } from '../../utils/types';
import dayjs from 'dayjs';

interface Props {
  chartData: ChartPoint[];
}

export const HeatmapChartView: React.FC<Props> = ({ chartData }) => {
  if (!chartData.length) return <p>No data</p>;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '4px',
        width: 'fit-content',
        margin: '0 auto',
      }}
    >
      {chartData.map((log, idx) => (
        <div
          key={idx}
          title={dayjs(log.date).format('MMM D')}
          style={{
            width: 20,
            height: 20,
            borderRadius: 3,
            backgroundColor: log.completed ? '#22c55e' : '#e5e7eb', // green / gray
          }}
        />
      ))}
    </div>
  );
};
