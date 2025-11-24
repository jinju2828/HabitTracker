import { LineDotChartView } from "./LineDotChartView";

export interface ChartItem {
  date: string;
  completed: number; // 🌿 날짜별 완료된 해빗 총 개수
}

export default function TotalLineChart({ chartData }: { chartData: ChartItem[] }) {
  if (!chartData || chartData.length === 0) {
    return <p>No data for line chart.</p>;
  }
  return <LineDotChartView chartData={chartData} />;
}
