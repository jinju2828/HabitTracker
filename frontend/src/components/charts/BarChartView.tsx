import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { parseISO, format } from "date-fns";

interface Props {
  chartData: { date: string; completed: number }[];
}

export const BarChartView: React.FC<Props> = ({ chartData }) => {
  const data = useMemo(() => {
    return chartData.map((item) => ({
      date: format(parseISO(item.date), "MM/dd"),
      completed: item.completed,
    }));
  }, [chartData]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="date" />

        {/* ✔ Y축: 해빗 개수 */}
        <YAxis
          allowDecimals={false}
          domain={[0, "dataMax"]}
          label={{ value: "Habits Completed", angle: -90, position: "insideLeft" }}
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
