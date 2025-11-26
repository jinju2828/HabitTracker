import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

interface HabitLog {
  log_date: string;
  completed: number | boolean;
}

interface Props {
  allLogs: HabitLog[];
  selectedYear: number;
  selectedMonth: number;
}

export default function TotalHeatmap({
  allLogs,
  selectedYear,
  selectedMonth,
}: Props) {
  const filtered = allLogs.filter((log) => {
    const d = new Date(log.log_date);
    return (
      d.getFullYear() === selectedYear &&
      d.getMonth() + 1 === selectedMonth
    );
  });

  const heatmapData = filtered.map((log) => ({
    date: log.log_date,
    count: Number(log.completed),
  }));

  const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`;
  const endDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-31`;

  return (
    <CalendarHeatmap
      startDate={startDate}
      endDate={endDate}
      values={heatmapData}
      classForValue={(value) => {
        const count = value?.count ?? 0; // ⭐ 안전하게 처리

        if (count === 0) return "color-empty";
        if (count === 1) return "color-scale-1";
        if (count === 2) return "color-scale-2";
        return "color-scale-3";
      }}
    />
  );
}
