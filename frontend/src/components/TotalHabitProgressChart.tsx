// TotalHabitProgressChart.tsx
import React, { useState, useMemo } from "react";
import { dayjsUTC } from "../utils/dateUtils";
import TotalLineChart from "./charts/TotalLineChart";
import TotalBarChart from "./charts/TotalBarChart";
import TotalHeatmap from "./charts/TotalHeatmap";

interface HabitLog {
  log_date: string; // "YYYY-MM-DD"
  completed: number | boolean;
}

interface Props {
  allLogs: HabitLog[];
}

export default function TotalHabitProgressChart({ allLogs }: Props) {
  const todayUTC = dayjsUTC();
  const [selectedYear, setSelectedYear] = useState<number>(todayUTC.year());
  const [selectedMonth, setSelectedMonth] = useState<number>(todayUTC.month() + 1);
  const [viewMode, setViewMode] = useState<"monthly" | "weekly">("monthly");

  // 1) UTC 기준 filtering
  const filteredLogs = useMemo(() => {
    return allLogs.filter((l) => {
      const d = dayjsUTC(l.log_date);
      return d.year() === selectedYear && d.month() + 1 === selectedMonth;
    });
  }, [allLogs, selectedYear, selectedMonth]);

  // 2) Daily aggregation (UTC)
  const dailyChartData = useMemo(() => {
    const start = dayjsUTC(`${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`).startOf("month");
    const end = start.endOf("month");

    const map: Record<string, number> = {};

    filteredLogs.forEach((l) => {
      const key = dayjsUTC(l.log_date).format("YYYY-MM-DD");
      map[key] = (map[key] || 0) + (typeof l.completed === "number" ? l.completed : Number(l.completed));
    });

    const out: { date: string; completed: number }[] = [];
    let cur = start;
    while (cur.isBefore(end) || cur.isSame(end, "day")) {
      const key = cur.format("YYYY-MM-DD");
      out.push({ date: key, completed: map[key] ?? 0 });
      cur = cur.add(1, "day");
    }
    return out;
  }, [filteredLogs, selectedYear, selectedMonth]);

  // 3) Weekly aggregation (UTC)
  const weeklyChartData = useMemo(() => {
    const map = new Map<string, number>();

    filteredLogs.forEach((l) => {
      const d = dayjsUTC(l.log_date);
      const weekStart = d.startOf("week").format("YYYY-MM-DD");
      map.set(weekStart, (map.get(weekStart) || 0) + (typeof l.completed === "number" ? l.completed : Number(l.completed)));
    });

    const keys = Array.from(map.keys()).sort();
    return keys.map((k) => ({ date: k, completed: map.get(k) || 0 }));
  }, [filteredLogs]);

  const chartData = viewMode === "weekly" ? weeklyChartData : dailyChartData;

  const heatmapLogs = dailyChartData.map((d) => ({
    log_date: d.date,
    completed: d.completed,
  }));

  return (
    <div style={{ marginTop: 20 }}>
      {/* Year + Month Selector */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>

        {/* YEAR */}
        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
          {Array.from(new Set(allLogs.map((l) => dayjsUTC(l.log_date).year())))
            .sort((a, b) => a - b)
            .map((y) => (
              <option key={y} value={y}>{y}년</option>
            ))}
        </select>

        {/* MONTH */}
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>{m}월</option>
          ))}
        </select>

        {/* View Mode */}
        <button
          onClick={() => setViewMode("monthly")}
          style={{ padding: "6px 10px", background: viewMode === "monthly" ? "#333" : "#eee", color: viewMode === "monthly" ? "#fff" : "#000" }}
        >
          월간
        </button>
        <button
          onClick={() => setViewMode("weekly")}
          style={{ padding: "6px 10px", background: viewMode === "weekly" ? "#333" : "#eee", color: viewMode === "weekly" ? "#fff" : "#000" }}
        >
          주간
        </button>
      </div>

      {/* Line / Bar / Heatmap */}
      <h3>Total Line Chart</h3>
      <div style={{ height: 240 }}>
        <TotalLineChart chartData={chartData} />
      </div>

      <h3>Total Bar Chart</h3>
      <div style={{ height: 240 }}>
        <TotalBarChart chartData={chartData} />
      </div>

      <h3>Total Heatmap</h3>
      <div style={{ marginTop: 8 }}>
        <TotalHeatmap allLogs={heatmapLogs} selectedYear={selectedYear} selectedMonth={selectedMonth} />
      </div>
    </div>
  );
}
