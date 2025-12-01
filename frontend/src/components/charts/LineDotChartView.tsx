import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { parseISO, format, isAfter } from "date-fns";

interface Props {
  chartData: { date: string; completed: number }[];
}

// ✅ 반드시 named export!
export const LineDotChartView: React.FC<Props> = ({ chartData }) => {
  const today = new Date();

  const data = useMemo(() => {
    return chartData
      .filter((item) => {
        const d = parseISO(item.date);
        return !isAfter(d, today); // 미래 날짜 제거
      })
      .map((item) => ({
        date: format(parseISO(item.date), "MM/dd"),
        completed: item.completed ?? 0,
      }));
  }, [chartData]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis
          allowDecimals={false}
          domain={[0, (dataMax: number) => Math.max(1, dataMax)]}
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
        <Line dataKey="completed" stroke="#4f46e5" dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};
