import TotalLineChart from "./charts/TotalLineChart";
import TotalBarChart from "./charts/TotalBarChart";
import { TotalHeatmap } from "./charts/TotalHeatmap";

// 원래 HabitLog 타입 그대로 사용 (date X, log_date O)
interface HabitLog {
  log_date: string;
  completed: number;
}

interface Props {
  allLogs: HabitLog[];
}

export default function TotalHabitProgressChart({ allLogs }: Props) {
  // chartData로 변환 (date 생성)
  const chartData = allLogs.map(log => ({
    date: log.log_date,
    completed: log.completed ? 1 : 0,  // ⭐ boolean → number 변환
  }));

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Total Line Chart</h3>
      <TotalLineChart chartData={chartData} />

      <h3>Total Bar Chart</h3>
      <TotalBarChart chartData={chartData} />

      <h3>Total Heatmap</h3>
      <TotalHeatmap allLogs={allLogs} /> 
    </div>
  );
}
