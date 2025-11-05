import React, { useState } from 'react';
import { LineDotChartView } from './charts/LineDotChartView';
import { BarChartView } from './charts/BarChartView';
import { HeatmapChartView } from './charts/HeatmapChartView';
import { Heatmap } from './charts/Heatmap';
import type { HabitLog, ChartPoint, HeatmapRow } from '../utils/types';

import { eachDayOfInterval, format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const timeZone = 'America/Los_Angeles';

function generateHeatmapData(habitStartDate: string, logs: { log_date: string; completed: boolean }[]) {
  const start = toZonedTime(parseISO(habitStartDate), timeZone);
  const today = toZonedTime(new Date(), timeZone);

  const dateRange = eachDayOfInterval({ start, end: today });

  const logMap = new Map(
    logs.map(log => {
      const zoned = toZonedTime(parseISO(log.log_date), timeZone);
      const key = format(zoned, 'yyyy-MM-dd');
      return [key, log.completed ? 1 : 0];
    })
  );

  return dateRange.map(date => {
    const key = format(date, 'yyyy-MM-dd');
    return {
      date: key,
      completed: logMap.get(key) ?? 0,
    };
  });
}

interface Props {
  habitLogs: HabitLog[];
}

export const HabitChartType: React.FC<Props> = ({ habitLogs }) => {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'heatmap'>('line');

  if (!habitLogs || habitLogs.length === 0) {
    return <p>No logs available.</p>;
  }

  const generateChartData = (logs: HabitLog[]): ChartPoint[] => {
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

  const chartData = generateChartData(habitLogs);

  // ✅ Heatmap 데이터 생성 시 첫 로그 날짜를 habit 시작일로 간주
  const habitStartDate = habitLogs[0]?.log_date ?? new Date().toISOString();

  const heatmapChartData = generateHeatmapData(habitStartDate, habitLogs);

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
        {/* {chartType === 'heatmap' && <HeatmapChartView chartData={heatmapChartData} />} */}
        {chartType === 'heatmap' && <Heatmap chartData={heatmapChartData} />}
      </div>
    </div>
  );
};
