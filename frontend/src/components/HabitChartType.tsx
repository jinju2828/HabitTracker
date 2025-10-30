import React, { useState } from 'react';
import { LineDotChartView } from './charts/LineDotChartView';
import { BarChartView } from './charts/BarChartView';
import { HeatmapChartView } from './charts/HeatmapChartView';
import type { HabitLog } from '../utils/types';

interface Props {
  habitLogs: HabitLog[];
}

export const HabitChartType: React.FC<Props> = ({ habitLogs }) => {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'heatmap'>('line');

  return (
    <div>
      <label>
        Chart Type:{' '}
        <select value={chartType} onChange={(e) => setChartType(e.target.value as any)}>
          <option value="line">Line & Dot</option>
          <option value="bar">Bar</option>
          <option value="heatmap">Heatmap</option>
        </select>
      </label>

      <div style={{ marginTop: 20, height: 300 }}>
        {chartType === 'line' && <LineDotChartView habitLogs={habitLogs} />}
        {chartType === 'bar' && <BarChartView habitLogs={habitLogs} />}
        {chartType === 'heatmap' && <HeatmapChartView habitLogs={habitLogs} />}
      </div>
    </div>
  );
};
