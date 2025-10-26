import React, { useState } from 'react';
import { BarChartView } from './charts/BarChartView';
import { HeatmapChartView } from './charts/HeatmapChartView';
import { LineDotChartView } from './charts/LineDotChartView';

type ChartType = 'line' | 'bar' | 'heatmap';

export const HabitChartType: React.FC = () => {
  const [chartType, setChartType] = useState<ChartType>('line');

  return (
    <div style={{ marginTop: 40 }}>
      <h2>📊 Choose your chart view</h2>

      <select
        value={chartType}
        onChange={(e) => setChartType(e.target.value as ChartType)}
        style={{
          padding: '8px',
          marginBottom: '20px',
          borderRadius: '8px',
        }}
      >
        <option value="line">✅ Line / Dot Chart</option>
        <option value="bar">📦 Bar Chart</option>
        <option value="heatmap">🔥 Heatmap (experimental)</option>
      </select>

      {/* 조건부 렌더링 */}
      {chartType === 'line' && <LineDotChartView />}
      {chartType === 'bar' && <BarChartView />}
      {chartType === 'heatmap' && <HeatmapChartView />}
    </div>
  );
};
