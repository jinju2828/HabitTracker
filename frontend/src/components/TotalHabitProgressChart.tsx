import { useState, useMemo } from "react";
import TotalLineChart from "./charts/TotalLineChart";
import TotalBarChart from "./charts/TotalBarChart";
import { TotalHeatmap } from "./charts/TotalHeatmap";

interface HabitLog {
  log_date: string;
  completed: boolean;
}

interface Props {
  allLogs: HabitLog[];
}

export default function TotalHabitProgressChart({ allLogs }: Props) {
  const [month, setMonth] = useState("all");

  // 🔥 1) 월별 필터링
  const filteredLogs = useMemo(() => {
    if (month === "all") return allLogs;
    return allLogs.filter((log) => log.log_date.startsWith(month));
  }, [month, allLogs]);

  // 🔥 2) 날짜별 완료 합산
  const chartData = useMemo(() => {
    const dailyTotals: Record<string, number> = {};

    filteredLogs.forEach((log) => {
      const date = log.log_date.split("T")[0];
      dailyTotals[date] =
        (dailyTotals[date] || 0) + (log.completed ? 1 : 0);
    });

    return Object.entries(dailyTotals).map(([date, completed]) => ({
      date,
      completed,
    }));
  }, [filteredLogs]);

  // 🔥 3) 월 선택 목록 자동 생성
  const monthList = useMemo(() => {
    const set = new Set<string>();
    allLogs.forEach((log) => {
      set.add(log.log_date.substring(0, 7)); // YYYY-MM
    });
    return ["all", ...Array.from(set).sort()];
  }, [allLogs]);

  return (
    <div style={{ marginTop: 20 }}>
      {/* 📌 Month Selector */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Month:</label>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {monthList.map((m) => (
            <option key={m} value={m}>
              {m === "all" ? "All" : m}
            </option>
          ))}
        </select>
      </div>

      <h3>Total Line Chart</h3>
      <div style={{ height: 250 }}>
        <TotalLineChart chartData={chartData} />
      </div>

      <h3>Total Bar Chart</h3>
      <div style={{ height: 250 }}>
        <TotalBarChart chartData={chartData} />
      </div>

      <h3>Total Heatmap</h3>
      <TotalHeatmap allLogs={filteredLogs} />
    </div>
  );
}
