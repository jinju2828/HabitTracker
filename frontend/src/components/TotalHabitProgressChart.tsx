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

  /** 1) 정확한 월 필터링 (UTC 기반) */
  const filteredLogs = useMemo(() => {
    return allLogs.filter((log) =>
      dayjs.utc(log.log_date).month() === selectedMonth
    );
  }, [allLogs, selectedMonth]);

  /** 2) 라인/바 차트용 chartData 생성 */
const chartData = useMemo(() => {
  const start = dayjs().month(selectedMonth).startOf("month");
  const end = dayjs().month(selectedMonth).endOf("month");

  const map: Record<string, number> = {};

  filteredLogs.forEach((log) => {
    const key = dayjs.utc(log.log_date).format("YYYY-MM-DD");

    // 날짜별 개수 누적 ⭐
    map[key] = (map[key] ?? 0) + (log.completed ? 1 : 0);
  });

  const result = [];
  let d = start;

  while (d.isBefore(end) || d.isSame(end, "day")) {
    const key = d.format("YYYY-MM-DD");

    result.push({
      date: key,
      completed: map[key] ?? 0, // 개수 그대로 사용
    });

    d = d.add(1, "day");
  }

  return result;
}, [filteredLogs, selectedMonth]);

  /** 3) Heatmap용 데이터 생성 */
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
      <TotalHeatmap allLogs={heatmapLogs} />
    </div>
  );
}
