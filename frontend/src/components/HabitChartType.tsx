import React, { useState } from 'react';
import { LineDotChartView } from './charts/LineDotChartView';
import { BarChartView } from './charts/BarChartView';
import { HeatmapChartView } from './charts/HeatmapChartView';
import type { HabitLog, ChartPoint } from '../utils/types';

interface Props {
  habitLogs: HabitLog[];
}

export const HabitChartType: React.FC<Props> = ({ habitLogs }) => {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'heatmap'>('line');

  // ✅ 1. 모든 날짜 포함, 체크 안한 날은 completed=0 처리
  const generateChartData = (logs: HabitLog[]): ChartPoint[] => {
    if (!logs.length) return [];

    // 날짜 순으로 정렬
    const sortedLogs = [...logs].sort(
      (a, b) => new Date(a.log_date).getTime() - new Date(b.log_date).getTime()
    );

    const start = new Date(sortedLogs[0].log_date);
    const end = new Date(sortedLogs[sortedLogs.length - 1].log_date);

    const dateArray: string[] = [];
    let current = new Date(start);
    while (current <= end) {
      dateArray.push(current.toISOString().slice(0, 10));
      current.setDate(current.getDate() + 1);
    }

    const logMap = new Map(sortedLogs.map(l => [l.log_date.slice(0, 10), l.completed ? 1 : 0]));

    return dateArray.map(date => ({
      date,
      completed: logMap.get(date) ?? 0,
    }));
  };

  const chartData: ChartPoint[] = generateChartData(habitLogs);

  // ✅ 2. Nivo Heatmap용 데이터 변환
  const transformToHeatmapData = (chartData: ChartPoint[]) => {
    if (!chartData.length) return [];

    const weeks: Record<string, { x: string; y: number }[]> = {};

    chartData.forEach(({ date, completed }) => {
      const d = new Date(date);
      const weekNumber = Math.ceil(d.getDate() / 7); // 같은 달 내 주차
      const weekKey = `${d.toLocaleString('default', {
        month: 'short',
      })} W${weekNumber}`; // 예: "Oct W1"
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue...

      if (!weeks[weekKey]) weeks[weekKey] = [];
      weeks[weekKey].push({ x: dayName, y: completed });
    });

    return Object.entries(weeks).map(([id, data]) => ({
      id,
      data,
    }));
  };

  const heatmapData = transformToHeatmapData(chartData);

  return (
    <div>
      <label>
        Chart Type:{' '}
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value as 'line' | 'bar' | 'heatmap')}
        >
          <option value="line">Line & Dot</option>
          <option value="bar">Bar</option>
          <option value="heatmap">Heatmap</option>
        </select>
      </label>

      <div style={{ marginTop: 20, height: 350 }}>
        {chartType === 'line' && <LineDotChartView chartData={chartData} />}
        {chartType === 'bar' && <BarChartView chartData={chartData} />}
        {chartType === 'heatmap' && <HeatmapChartView data={heatmapData} />}
      </div>
    </div>
  );
};
