// src/components/charts/HeatmapChartView.tsx
import React from 'react';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import type { HeatmapRow } from '../../utils/types';

interface HeatmapChartViewProps {
  chartData: HeatmapRow[]; // <-- 여기에서 ChartPoint[]이 아니어야 함
}

export const HeatmapChartView: React.FC<HeatmapChartViewProps> = ({ chartData }) => {
  if (!chartData || chartData.length === 0) {
    return <p>No data available for heatmap.</p>;
  }

  return (
    <div style={{ height: 350 }}>
      <ResponsiveHeatMap
        data={chartData}                      // HeatmapRow[] 형태여야 함
        margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
        valueFormat=".0f"
        colors={{ type: 'sequential', scheme: 'greens' }}
        emptyColor="#f0f0f0"
        borderColor={{ from: 'color', modifiers: [['darker', 0.5]] }}
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: 'Date',
          legendOffset: 36,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Weeks',
          legendOffset: -72,
        }}
        enableLabels={false}
        hoverTarget="cell"
        tooltip={({ cell }) => (
          <div style={{
            background: 'white',
            padding: '6px 8px',
            borderRadius: 4,
            boxShadow: '0 2px 10px rgba(0,0,0,0.12)'
          }}>
            <strong>{cell.serieId} / {cell.data.x}</strong>
            <div>{cell.data.y ? '✅ Completed' : '❌ Missed'}</div>
          </div>
        )}
        animate
        motionConfig="gentle"
      />
    </div>
  );
};

export default HeatmapChartView;
