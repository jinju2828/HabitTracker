import TotalLineChart from "./charts/TotalLineChart";
import TotalBarChart from "./charts/TotalBarChart";
import { TotalHeatmap } from "./charts/TotalHeatmap";

interface LogItem {
  date: string;
  completed: number;
}

interface Props {
  allLogs: LogItem[];
}

export default function TotalHabitProgressChart({ allLogs }) {
  return (
    <div style={{ marginTop: 20 }}>
      <TotalLineChart allLogs={allLogs} />
      <TotalBarChart allLogs={allLogs} />
      <TotalHeatmap allLogs={allLogs} />
    </div>
  );

}
