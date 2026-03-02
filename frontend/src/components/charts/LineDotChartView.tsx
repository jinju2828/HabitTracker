import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";

interface Props {
  chartData: { date: string; completed: number }[];
}

export const LineDotChartView: React.FC<Props> = ({ chartData }) => {
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const data = useMemo(() => {
    return chartData
      .filter((item) => item.date <= todayStr) // ← local date 기준!
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
            position: "outerLeft",
          }}
        />
        <Tooltip formatter={(v) => `${v}회`} />
        <Line dataKey="completed" stroke="#4CAF50" dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};
