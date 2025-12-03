import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { parseISO, format, isAfter } from "date-fns";

interface Props {
  chartData: { date: string; completed: number }[]; // string 유지
}

export const BarChartView: React.FC<Props> = ({ chartData }) => {
  const today = new Date();

  const data = useMemo(() => {
  return chartData
    .filter((item) => {
      const d = new Date(item.date + "T00:00:00Z"); // ← UTC 기준!
      return !isAfter(d, today);
    })
    .map((item) => ({
      date: format(new Date(item.date + "T00:00:00Z"), "MM/dd"), // ← UTC 기준!
      completed: item.completed ?? 0,
    }));
}, [chartData]);


  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="date" />

        <YAxis
          allowDecimals={false}
          domain={[0, (dataMax: number) => Math.max(1, dataMax)]} // 최소 1 보장
          label={{
            value: "Habits Completed",
            angle: -90,
            position: "insideLeft",
          }}
        />

        <Tooltip
          labelFormatter={(label) => `Date: ${label}`}
          contentStyle={{ color: "#000" }}
          formatter={(v: any) => `${v} completed`}
        />

        <Bar dataKey="completed" fill="#4f46e5" />
      </BarChart>
    </ResponsiveContainer>
  );
};
