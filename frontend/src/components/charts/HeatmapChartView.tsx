import React from 'react';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import type { HeatmapRow } from '../../utils/types';

interface HeatmapChartViewProps {
  chartData: HeatmapRow[];
}

export const HeatmapChartView: React.FC<HeatmapChartViewProps> = ({ chartData }) => {
  if (!chartData || chartData.length === 0) {
    return <p>No data available for heatmap.</p>;
  }

  // ✅ Tooltip helper: week + weekday → date 계산 함수
  const getDateFromWeekLabel = (weekLabel: string, weekday: string): string | null => {
    // 예: "Nov W2" → month = "Nov", weekNumber = 2
    const match = weekLabel.match(/(\w+)\sW(\d+)/);
    if (!match) return null;

    const [, monthName, weekNumStr] = match;
    const weekNum = parseInt(weekNumStr, 10);

    const monthIndex = new Date(`${monthName} 1, 2025`).getMonth(); // <- 연도는 임시 (필요시 변수화)
    const weekdayIndex = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(weekday);
    if (weekdayIndex === -1) return null;

    // 주차*7 + 요일 기반으로 날짜 계산
    const dayOfMonth = (weekNum - 1) * 7 + weekdayIndex + 1;
    const date = new Date(2025, monthIndex, dayOfMonth);
    if (isNaN(date.getTime())) return null;

    return date.toISOString().slice(0, 10);
  };

  return (
    <div style={{ height: 350 }}>
      <ResponsiveHeatMap
        data={chartData}
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
        tooltip={({ cell }) => {
          const fullDate = getDateFromWeekLabel(cell.serieId, cell.data.x);
          return (
            <div
              style={{
                background: 'white',
                padding: '6px 8px',
                borderRadius: 4,
                boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
              }}
            >
              <strong style={{ color: 'black' }}>
                📅 {fullDate || `${cell.serieId} / ${cell.data.x}`}
              </strong>
              <div>{cell.data.y ? '✅ Completed' : '❌ Missed'}</div>
            </div>
          );
        }}
        animate
        motionConfig="gentle"
      />
    </div>
  );
};

export default HeatmapChartView;
