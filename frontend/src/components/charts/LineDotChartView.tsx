import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { isAfterUTC, formatDisplay, parseDateUTC, getTodayUTC } from "../../utils/dateUtils";

interface Props {
  chartData: { date: string; completed: number }[];
}

export const LineDotChartView: React.FC<Props> = ({ chartData }) => {
  const today = parseDateUTC(getTodayUTC());

  const data = useMemo(() => {
    return chartData
      .filter((item) => !isAfterUTC(item.date, today))
      .map((item) => ({
        date: formatDisplay(item.date),
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
        />
        <Tooltip formatter={(v) => `${v}회`} />
        <Line dataKey="completed" stroke="#4f46e5" dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};
