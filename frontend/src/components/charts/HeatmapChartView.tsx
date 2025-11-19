import React from 'react';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const timeZone = 'America/Los_Angeles';

interface HeatmapChartViewProps {
  chartData: { date: string; completed: number }[];
}

/**
 * 주별로 Mon~Sun을 완전하게 채워서 히트맵에 항상 7칸 나오게 처리
 */
const groupByWeek = (chartData: { date: string; completed: number }[]) => {
  const weeks: Record<
    string,
    Record<string, { x: string; y: number; fullDate: string }>
  > = {};

  chartData.forEach(({ date, completed }) => {
    const zoned = toZonedTime(parseISO(date), timeZone);
    const weekKey = format(zoned, "'W'w");
    const dayName = format(zoned, "EEE");
    const fullDate = format(zoned, "MM/dd");

    if (!weeks[weekKey]) weeks[weekKey] = {};

    weeks[weekKey][dayName] = {
      x: dayName,
      y: completed,
      fullDate,
    };
  });

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return Object.entries(weeks).map(([id, week]) => ({
    id,
    data: days.map((day) => {
      if (week[day]) return week[day];
      return {
        x: day,
        y: 0,
        fullDate: "",
      };
    }),
  }));
};

export const HeatmapChartView: React.FC<HeatmapChartViewProps> = ({ chartData }) => {
  const heatmapRows = groupByWeek(chartData);

  return (
    <ResponsiveHeatMap
      data={heatmapRows}
      margin={{ top: 30, right: 40, bottom: 40, left: 40 }}
      valueFormat=".0f"
      axisTop={{
        tickSize: 5,
        tickPadding: 5,
        legend: "Week",
        legendOffset: -24,
      }}
      axisRight={null}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        legend: "Day",
        legendPosition: "middle",
        legendOffset: -30,
      }}
      colors={{
        type: "diverging",
        scheme: "greens",
        minValue: 0,
        maxValue: 1,
      }}
      emptyColor="#eeeeee"
      borderWidth={1}
      borderColor="#ffffff"
      tooltip={({ cell }) => {
        const { fullDate, y } = cell.data as { fullDate: string; y: number };
        return (
          <div
            style={{
              background: "white",
              padding: "6px 8px",
              borderRadius: 4,
              boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
              color: "#111",
            }}
          >
            <div><strong>{fullDate || "No date"}</strong></div>
            <div>{y === 1 ? "✅ Completed" : "❌ Missed"}</div>
          </div>
        );
      }}
    />
  );
};
