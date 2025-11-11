import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
} from "recharts";
import dayjs from "dayjs";

interface HabitLog {
  date: string;
  completed: boolean;
}

interface TotalHeatmapProps {
  allLogs: HabitLog[];
}

export const TotalHeatmap: React.FC<TotalHeatmapProps> = ({ allLogs }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(dayjs().month());

  // ✅ 월별 필터링
  const filteredLogs = useMemo(
    () =>
      allLogs.filter((log) => dayjs(log.date).month() === selectedMonth),
    [allLogs, selectedMonth]
  );

  // ✅ 주별로 묶기
  const weeks = useMemo(() => {
    const byWeek: Record<string, HabitLog[]> = {};
    filteredLogs.forEach((log) => {
      const weekKey = dayjs(log.date).startOf("week").format("YYYY-MM-DD");
      if (!byWeek[weekKey]) byWeek[weekKey] = [];
      byWeek[weekKey].push(log);
    });

    return Object.keys(byWeek)
      .sort()
      .map((weekKey) => {
        const days = Array.from({ length: 7 }).map((_, i) => {
          const date = dayjs(weekKey).add(i, "day");
          const log = byWeek[weekKey].find((l) =>
            dayjs(l.date).isSame(date, "day")
          );
          return {
            date: date.toISOString(),
            completed: log ? log.completed : false,
          };
        });
        return { week: weekKey, days };
      });
  }, [filteredLogs]);

  const months = Array.from({ length: 12 }, (_, i) => ({
    label: dayjs().month(i).format("MMMM"),
    value: i,
  }));

  return (
    <div className="flex flex-col gap-4">
      {/* ✅ 월 선택 필터 */}
      <div className="flex justify-end mb-2">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="border rounded px-3 py-1 text-sm"
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Heatmap Chart */}
      <div className="w-full h-[280px]">
        <ResponsiveContainer>
          <ComposedChart
            layout="vertical"
            data={weeks}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          >
            <YAxis
              dataKey="week"
              type="category"
              tickFormatter={(v) => dayjs(v).format("MMM D")}
              width={70}
            />
            <XAxis type="number" hide />
            <Tooltip
              content={({ payload }) => {
                if (!payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-white p-2 border rounded text-xs">
                    {dayjs(d.date).format("MMM D")} —{" "}
                    {d.completed ? "✅ Completed" : "❌ Missed"}
                  </div>
                );
              }}
            />

            <Bar dataKey="days">
              {weeks.flatMap((week) =>
                week.days.map((day, i) => (
                  <Cell
                    key={`${week.week}-${i}`}
                    fill={day.completed ? "#22c55e" : "#f5f5f5"}
                  />
                ))
              )}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};