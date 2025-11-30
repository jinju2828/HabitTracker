import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { parseISO, format } from "date-fns";

interface Props {
  chartData: { date: string; completed: number }[]; // <-- string으로 통일
}

export const LineDotChartView: React.FC<Props> = ({ chartData }) => {
  const data = useMemo(() => {
    return chartData.map((item) => ({
      date: format(parseISO(item.date), "MM/dd"), // 문자열 그대로 parseISO
      completed: item.completed,
    }));
  }, [chartData]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="date" />
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
        <Line dataKey="completed" stroke="#4f46e5" dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};
