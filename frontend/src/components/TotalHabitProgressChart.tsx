import { useState, useMemo } from "react";
import dayjs from "dayjs";

import TotalLineChart from "./charts/TotalLineChart";
import TotalBarChart from "./charts/TotalBarChart";
import TotalHeatmap from "./charts/TotalHeatmap";

import "../styles/TotalHabitProgressChart.css";

interface HabitLog {
  log_date: string; // "YYYY-MM-DD"
  completed: number | boolean;
}

interface Props {
  allLogs: HabitLog[];
}

// 🔥 핵심: 날짜 문자열 그대로 쓰는 함수
const normalizeDate = (dateStr: string) => dateStr.slice(0, 10);

export default function TotalHabitProgressChart({ allLogs }: Props) {
  const today = dayjs();

  const [selectedYear, setSelectedYear] = useState<number>(today.year());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.month() + 1);
  const [viewMode, setViewMode] = useState<"monthly" | "weekly">("monthly");

  // ✅ 1) filtering (문자열 기반)
  const filteredLogs = useMemo(() => {
    return allLogs.filter((l) => {
      const d = normalizeDate(l.log_date);

      return (
        Number(d.slice(0, 4)) === selectedYear &&
        Number(d.slice(5, 7)) === selectedMonth
      );
    });
  }, [allLogs, selectedYear, selectedMonth]);

  // ✅ 2) Daily aggregation (안전)
  const dailyChartData = useMemo(() => {
    const start = dayjs(
      `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`
    ).startOf("month");

    const end = start.endOf("month");

    const map: Record<string, number> = {};

    filteredLogs.forEach((l) => {
      const key = normalizeDate(l.log_date); // 🔥 핵심 수정
      const value =
        typeof l.completed === "number"
          ? l.completed
          : Number(l.completed);

      map[key] = (map[key] || 0) + value;
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

  // ✅ 3) Weekly aggregation (포맷 명시)
  const weeklyChartData = useMemo(() => {
    const map = new Map<string, number>();

    filteredLogs.forEach((l) => {
      const dateStr = normalizeDate(l.log_date);

      // 🔥 포맷 명시해서 timezone 방지
      const d = dayjs(dateStr, "YYYY-MM-DD");

      const weekStart = d.startOf("week").format("YYYY-MM-DD");

      const value =
        typeof l.completed === "number"
          ? l.completed
          : Number(l.completed);

      map.set(weekStart, (map.get(weekStart) || 0) + value);
    });

    const keys = Array.from(map.keys()).sort();

    return keys.map((k) => ({
      date: k,
      completed: map.get(k) || 0,
    }));
  }, [filteredLogs]);

  const chartData =
    viewMode === "weekly" ? weeklyChartData : dailyChartData;

  // ✅ heatmap용 데이터 (이미 safe)
  const heatmapLogs = dailyChartData.map((d) => ({
    log_date: d.date,
    completed: d.completed,
  }));

  // ✅ availableYears도 문자열 기반으로
  const availableYears = Array.from(
    new Set(allLogs.map((l) => Number(l.log_date.slice(0, 4))))
  ).sort((a, b) => a - b);

  return (
    <div
      className="total-habit-progress-chart"
      style={{ marginTop: 20 }}
    >
      {/* Year + Month Selector */}
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        {/* YEAR */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {availableYears.map((y) => (
            <option key={y} value={y}>
              {y}년
            </option>
          ))}
        </select>

        {/* MONTH */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {m}월
            </option>
          ))}
        </select>

        {/* View Mode */}
        <button
          onClick={() => setViewMode("monthly")}
          style={{
            padding: "6px 10px",
            background: viewMode === "monthly" ? "#333" : "#eee",
            color: viewMode === "monthly" ? "#fff" : "#000",
          }}
        >
          Monthly
        </button>

        <button
          onClick={() => setViewMode("weekly")}
          style={{
            padding: "6px 10px",
            background: viewMode === "weekly" ? "#333" : "#eee",
            color: viewMode === "weekly" ? "#fff" : "#000",
          }}
        >
          Weekly
        </button>
      </div>

      {/* Charts */}
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
        <TotalHeatmap
          allLogs={heatmapLogs}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
      </div>
    </div>
  );
}