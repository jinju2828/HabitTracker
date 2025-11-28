import { useState, useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import TotalLineChart from "./charts/TotalLineChart";
import TotalBarChart from "./charts/TotalBarChart";
import TotalHeatmap from "./charts/TotalHeatmap";

dayjs.extend(utc);

interface HabitLog {
  log_date: string; // YYYY-MM-DD or ISO
  completed: number | boolean; // true/false or number
}

interface Props {
  allLogs: HabitLog[];
}

export default function TotalHabitProgressChart({ allLogs }: Props) {
  const today = dayjs();
  const [selectedYear, setSelectedYear] = useState<number>(today.year());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.month() + 1); // 1..12
  const [viewMode, setViewMode] = useState<"monthly" | "weekly">("monthly");

  // available years
  const years = useMemo(() => {
    const s = Array.from(new Set(allLogs.map((l) => dayjs.utc(l.log_date).year())));
    return s.sort((a, b) => a - b);
  }, [allLogs]);

  // 1) filter logs to selected year & month
  const filteredLogs = useMemo(() => {
    return allLogs.filter((l) => {
      const d = dayjs.utc(l.log_date);
      return d.year() === selectedYear && d.month() + 1 === selectedMonth;
    });
  }, [allLogs, selectedYear, selectedMonth]);

  // 2) build daily aggregated counts for the month (every date present, ordered)
  const dailyChartData = useMemo(() => {
    const start = dayjs.utc(`${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`).startOf("month");
    const end = start.endOf("month");

    // map counts
    const map: Record<string, number> = {};
    filteredLogs.forEach((l) => {
      const key = dayjs.utc(l.log_date).format("YYYY-MM-DD");
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

  // 3) weekly aggregated (if viewMode === 'weekly')
  const weeklyChartData = useMemo(() => {
    // group by ISO week starting Sunday -> we'll use weekStart Sunday for consistency
    const map = new Map<string, number>();
    filteredLogs.forEach((l) => {
      const d = dayjs.utc(l.log_date);
      // get week starting date (Sunday)
      const weekStart = d.startOf("week").format("YYYY-MM-DD");
      map.set(weekStart, (map.get(weekStart) || 0) + (typeof l.completed === "number" ? l.completed : Number(l.completed)));
    });
    // sort keys (weekStart asc)
    const keys = Array.from(map.keys()).sort((a, b) => (a < b ? -1 : 1));
    return keys.map((k) => ({ date: k, completed: map.get(k) || 0 }));
  }, [filteredLogs]);

  // choose chartData based on viewMode
  const chartData = viewMode === "weekly" ? weeklyChartData : dailyChartData;

  // heatmap expects allLogs-like with log_date + completed count per day.
  // We'll reuse dailyChartData to pass in as allLogs (TotalHeatmap expects log_date & completed number)
  const heatmapLogs = dailyChartData.map((d) => ({ log_date: d.date, completed: d.completed }));

  return (
    <div style={{ marginTop: 20 }}>
      {/* controls */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
          {years.map((y) => (<option key={y} value={y}>{y}년</option>))}
        </select>

        <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>{m}월</option>
          ))}
        </select>

        <button onClick={() => setViewMode("monthly")} style={{ padding: "6px 10px", background: viewMode === "monthly" ? "#333" : "#eee", color: viewMode === "monthly" ? "#fff" : "#000" }}>월간</button>
        <button onClick={() => setViewMode("weekly")} style={{ padding: "6px 10px", background: viewMode === "weekly" ? "#333" : "#eee", color: viewMode === "weekly" ? "#fff" : "#000" }}>주간</button>
      </div>

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
