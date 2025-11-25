import { useState, useMemo } from "react";
import TotalLineChart from "./charts/TotalLineChart";
import TotalBarChart from "./charts/TotalBarChart";
import { TotalHeatmap } from "./charts/TotalHeatmap";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

interface HabitLog {
  log_date: string;
  completed: boolean;
}

interface Props {
  allLogs: HabitLog[];
}

export default function TotalHabitProgressChart({ allLogs }: Props) {
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month());

  /** 정확한 월 필터링 */
  const filteredLogs = useMemo(() => {
    return allLogs.filter((log) =>
      dayjs.utc(log.log_date).month() === selectedMonth
    );
  }, [allLogs, selectedMonth]);

  /** Line / Bar chart data */
  const chartData = useMemo(() => {
    const start = dayjs().month(selectedMonth).startOf("month");
    const end = dayjs().month(selectedMonth).endOf("month");

    const map: Record<string, number> = {};

    filteredLogs.forEach((log) => {
      const key = dayjs.utc(log.log_date).format("YYYY-MM-DD");
      map[key] = (map[key] ?? 0) + (log.completed ? 1 : 0);
    });

    const result = [];
    let d = start;

    while (d.isBefore(end) || d.isSame(end, "day")) {
      const key = d.format("YYYY-MM-DD");
      result.push({
        date: key,
        completed: map[key] ?? 0,
      });
      d = d.add(1, "day");
    }

    return result;
  }, [filteredLogs, selectedMonth]);

  /** Heatmap 용 데이터 */
  const heatmapLogs = chartData.map((d) => ({
    log_date: d.date,
    completed: d.completed,
  }));

  return (
    <div style={{ marginTop: 20 }}>
      {/* Month selector */}
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(Number(e.target.value))}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <option key={i} value={i}>
            {dayjs().month(i).format("MMMM")}
          </option>
        ))}
      </select>

      <h3>Total Line Chart</h3>
      <div style={{ height: 250 }}>
        <TotalLineChart chartData={chartData} />
      </div>

      <h3>Total Bar Chart</h3>
      <div style={{ height: 250 }}>
        <TotalBarChart chartData={chartData} />
      </div>

      <h3>Total Heatmap</h3>
      {/* Heatmap도 동일한 월 기반 log 전달 */}
      <TotalHeatmap allLogs={heatmapLogs} selectedMonth={selectedMonth} />
    </div>
  );
}
