import { useState, useMemo } from "react";
import TotalLineChart from "./charts/TotalLineChart";
import TotalBarChart from "./charts/TotalBarChart";
import TotalHeatmap from "./charts/TotalHeatmap";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

interface HabitLog {
  log_date: string; // YYYY-MM-DD
  completed: number | boolean;
}

interface Props {
  allLogs: HabitLog[];
}

export default function TotalHabitProgressChart({ allLogs }: Props) {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [viewMode, setViewMode] = useState<"monthly" | "weekly">("monthly");

  const years = Array.from(
    new Set(allLogs.map((log) => new Date(log.log_date).getFullYear()))
  ).sort();

  const filteredLogs = allLogs.filter((log) => {
    const d = new Date(log.log_date);
    return (
      d.getFullYear() === selectedYear &&
      d.getMonth() + 1 === selectedMonth
    );
  });

  // 1) daily 기준 데이터 생성
  const dailyData = filteredLogs.map((log) => ({
    date: log.log_date,
    completed: Number(log.completed),
  }));

  // 2) weekly 집계 → date 필드 통일
  const weeklyData = useMemo(() => {
    const map = new Map<string, number>();

    filteredLogs.forEach((log) => {
      const d = new Date(log.log_date);
      const week = Math.ceil((d.getDate() - d.getDay() + 1) / 7);
      const key = `${selectedYear}-${selectedMonth}-W${week}`;

      map.set(key, (map.get(key) || 0) + Number(log.completed));
    });

    return Array.from(map.keys()).map((key) => ({
      date: key, // 중요! date 필드로 통일
      completed: map.get(key) || 0,
    }));
  }, [filteredLogs, selectedYear, selectedMonth]);

  // 최종 chartdata
  const chartData = viewMode === "weekly" ? weeklyData : dailyData;

  return (
    <div style={{ marginTop: 20 }}>
      {/* ===== YEAR / MONTH SELECT ===== */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}년
            </option>
          ))}
        </select>

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

        {/* WEEK / MONTH 버튼 */}
        <button
          onClick={() => setViewMode("monthly")}
          style={{
            padding: "5px 10px",
            background: viewMode === "monthly" ? "#333" : "#eee",
            color: viewMode === "monthly" ? "white" : "black",
          }}
        >
          월간
        </button>

        <button
          onClick={() => setViewMode("weekly")}
          style={{
            padding: "5px 10px",
            background: viewMode === "weekly" ? "#333" : "#eee",
            color: viewMode === "weekly" ? "white" : "black",
          }}
        >
          주간
        </button>
      </div>

      <h3>Total Line Chart</h3>
      <TotalLineChart chartData={chartData} />

      <h3>Total Bar Chart</h3>
      <TotalBarChart chartData={chartData} />

      <h3>Total Heatmap</h3>
      <TotalHeatmap
        allLogs={allLogs}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
      />
    </div>
  );
}
