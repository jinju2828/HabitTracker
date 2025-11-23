import { LineDotChartView } from "./LineDotChartView";

export default function TotalLineChart({ allLogs }: { allLogs: any[] }) {

  const chartData = allLogs.map(log => ({
    date: log.log_date,      // 🔥 LineChart가 요구하는 필드로 변환
    completed: log.completed // 그대로 사용
  }));

  return <LineDotChartView chartData={chartData} />;
}
