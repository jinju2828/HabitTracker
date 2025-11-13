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
  log_date: string;
  completed: boolean;
}

interface TotalHeatmapProps {
  allLogs: HabitLog[];
}

export const TotalHeatmap: React.FC<TotalHeatmapProps> = ({ allLogs }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(dayjs().month());

  // -----------------------------------------------------
  // 1) 날짜별 -> 완료한 습관 개수(count)로 변환
  // -----------------------------------------------------
  const dailyCount = useMemo(() => {
    const map: Record<string, number> = {};

    allLogs.forEach((l) => {
      const date = dayjs(l.log_date).format("YYYY-MM-DD");
      if (!map[date]) map[date] = 0;
      if (l.completed) map[date] += 1;
    });

    return map; // { "2025-02-11": 2, ... }
  }, [allLogs]);

  // -----------------------------------------------------
  // 2) 월별 필터링
  // -----------------------------------------------------
  const monthDates = useMemo(() => {
    return Object.keys(dailyCount).filter(
      (d) => dayjs(d).month() === selectedMonth
    );
  }, [dailyCount, selectedMonth]);

  // -----------------------------------------------------
  // 3) week → dayIndex 구조로 변환 (Recharts용)
  // -----------------------------------------------------
  const heatmapData = useMemo(() => {
    const weeks: Record<string, any[]> = {};

    monthDates.forEach((dateString) => {
      const date = dayjs(dateString);
      const weekKey = date.startOf("week").format("YYYY-MM-DD");

      if (!weeks[weekKey]) weeks[weekKey] = [];

      const dayIndex = date.day(); // 0~6
      const count = dailyCount[dateString];

      weeks[weekKey].push({
        week: weekKey,
        dayIndex,
        date: dateString,
        count,
      });
    });

    // Recharts는 1개의 row에 7개 칸이 필요
    const flat: any[] = [];

    Object.keys(weeks)
      .sort()
      .forEach((weekKey) => {
        for (let i = 0; i < 7; i++) {
          const found = weeks[weekKey].find((w) => w.dayIndex === i);

          flat.push(
            found || {
              week: weekKey,
              dayIndex: i,
              date: dayjs(weekKey).add(i, "day").format("YYYY-MM-DD"),
              count: 0,
            }
          );
        }
      });

    return flat;
  }, [monthDates, dailyCount]);

  // -----------------------------------------------------
  // 색상 단계 (GitHub style)
  // -----------------------------------------------------
  const getColor = (count: number) => {
    if (count === 0) return "#ebedf0"; // light gray
    if (count === 1) return "#c6e48b";
    if (count === 2) return "#7bc96f";
    if (count === 3) return "#239a3b";
    return "#196127"; // 4개 이상
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    label: dayjs().month(i).format("MMMM"),
    value: i,
  }));

  // -----------------------------------------------------
  // 렌더
  // -----------------------------------------------------
  return (
    <div className="flex flex-col gap-4">
      {/* Month filter */}
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

      {/* Heatmap */}
      <div className="w-full h-[280px]" style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
  <ComposedChart
    layout="vertical"
    data={heatmapData}
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
            {dayjs(d.date).format("MMM D")} — {d.count} habits completed
          </div>
        );
      }}
    />

    <Bar dataKey="dummy" barSize={20}>
      {heatmapData.map((d, idx) => (
        <Cell key={idx} fill={getColor(d.count)} />
      ))}
    </Bar>
  </ComposedChart>
</ResponsiveContainer>


      </div>
    </div>
  );
};
