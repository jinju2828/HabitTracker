import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import type { HabitLog, ChartPoint } from "@/utils/types";

interface Props {
  allLogs: HabitLog[];
  selectedMonth?: number;
}

export const LineDotChartView: React.FC<Props> = ({ allLogs, selectedMonth }) => {
  const month = selectedMonth ?? dayjs().month();

  const chartData: ChartPoint[] = useMemo(() => {
    const start = dayjs().month(month).startOf("month");
    const end = dayjs().month(month).endOf("month");
    const data: ChartPoint[] = [];

    for (let d = start; d.isBefore(end) || d.isSame(end, "day"); d = d.add(1, "day")) {
      const log = allLogs.find((l) => dayjs(l.log_date).isSame(d, "day"));
      data.push({
        date: d.format("YYYY-MM-DD"),
        completed: log ? 1 : 0, // 누락일 0 처리
      });
    }

    return data;
  }, [allLogs, month]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis ticks={[0, 1]} tickFormatter={(v) => (v === 1 ? "✅" : "❌")} />
        <Tooltip formatter={(val: number) => (val === 1 ? "Completed" : "Not done")} />
        <Line type="monotone" dataKey="completed" stroke="#8884d8" dot />
      </LineChart>
    </ResponsiveContainer>
  );
};
