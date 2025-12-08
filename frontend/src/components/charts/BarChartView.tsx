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

  const todayStr = format(today, "yyyy-MM-dd");

const data = useMemo(() => {
  return chartData
    .filter((item) => {
      // 문자열 기반으로 비교 (시간 영향 없음)
      return item.date <= todayStr;
    })
    .map((item) => ({
      // 표시용 날짜 포맷 (그냥 local 기준으로 변환)
      date: format(parseISO(item.date), "MM/dd"),
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
