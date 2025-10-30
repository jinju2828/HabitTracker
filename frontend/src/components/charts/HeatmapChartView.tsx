import React from 'react';
import type { ChartPoint } from '../../utils/types';
import dayjs from 'dayjs';

interface Props {
  chartData: ChartPoint[];
}

export const HeatmapChartView: React.FC<Props> = ({ chartData }) => {
  return (
    <div className="grid grid-cols-7 gap-1">
      {chartData.map((log, idx) => (
        <div
          key={idx}
          title={dayjs(log.date).format('MMM D')}
          className={`w-4 h-4 rounded-sm ${
            log.completed ? 'bg-green-500' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
};
