import { BarChartView } from "./BarChartView";

type ChartItem = {
  date: string;
  completed: number;
};

export default function TotalBarChart({ chartData }: { chartData: ChartItem[] }) {
  if (!chartData || chartData.length === 0) {
    return <p>No data for bar chart.</p>;
  }

  return (
    <div style={{ width: "100%", height: 300 }}>   {/* ★ height 추가 */}
      <BarChartView chartData={chartData} />
    </div>
  );
}
