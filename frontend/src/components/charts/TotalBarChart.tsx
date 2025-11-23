import { BarChartView } from "./BarChartView";

export default function TotalBarChart({ allLogs }: { allLogs: any[] }) {

  const chartData = allLogs.map(log => ({
    date: log.log_date,
    completed: log.completed
  }));

  return <BarChartView chartData={chartData} />;
}
