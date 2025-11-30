// TotalLineChart.tsx
import React, { useMemo } from "react";
import { LineDotChartView } from "./LineDotChartView";

export interface ChartItem {
  date: string; // YYYY-MM-DD
  completed: number;
}

export default function TotalLineChart({ chartData }: { chartData: ChartItem[] }) {
  if (!chartData || chartData.length === 0) return <p>No data for line chart.</p>;
  return <LineDotChartView chartData={chartData} />;
}
