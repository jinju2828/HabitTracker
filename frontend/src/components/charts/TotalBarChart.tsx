import { BarChartView } from "./BarChartView";

export interface ChartItem {
  date: string;
  completed: number; // 🌿 날짜별 완료된 해빗 총 개수
}

export default function TotalBarChart({ chartData }: { chartData: ChartItem[] }) {
  if (!chartData || chartData.length === 0) {
    return <p>No data for bar chart.</p>;
  }
  return <BarChartView chartData={chartData} />;
}
