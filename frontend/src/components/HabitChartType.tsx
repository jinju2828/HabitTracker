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

  // 모든 날짜 포함, 체크 안한 날은 completed=0 처리
  const generateChartData = (logs: HabitLog[]): ChartPoint[] => {
    if (!logs.length) return [];

    const start = new Date(logs[0].log_date);
    const end = new Date(logs[logs.length - 1].log_date);

    const dateArray: string[] = [];
    let current = new Date(start);
    while (current <= end) {
      dateArray.push(current.toISOString().slice(0, 10));
      current.setDate(current.getDate() + 1);
    }

    const logMap = new Map(logs.map(l => [l.log_date.slice(0, 10), l.completed ? 1 : 0]));

    return dateArray.map(date => ({
      date,
      completed: logMap.get(date) ?? 0,
    }));
  };

  const chartData: ChartPoint[] = generateChartData(habitLogs);

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
        {chartType === 'line' && <LineDotChartView chartData={chartData} />}
        {chartType === 'bar' && <BarChartView chartData={chartData} />}
        {chartType === 'heatmap' && <HeatmapChartView chartData={chartData} />}
      </div>
    </div>
  );
};
