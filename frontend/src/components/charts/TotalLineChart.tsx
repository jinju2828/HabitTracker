import { LineDotChartView } from "./LineDotChartView";

type ChartItem = {
  date: string;
  completed: number;
};

export default function TotalLineChart({ chartData }: { chartData: ChartItem[] }) {
  
  console.log("TotalLineChart received chartData:", chartData);
  if (!chartData || chartData.length === 0) {
    return <p>No data for line chart.</p>;
  }

  return (
    <div style={{ width: "100%", height: 300 }}>   {/* ★ height 추가 */}
      <LineDotChartView chartData={chartData} />
    </div>
  );
}
