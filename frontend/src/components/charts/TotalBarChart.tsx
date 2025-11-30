// TotalBarChart.tsx
import React, { useMemo } from "react";
import { BarChartView } from "./BarChartView";

export interface ChartItem {
  date: string; // YYYY-MM-DD
  completed: number;
}

export default function TotalBarChart({ chartData }: { chartData: ChartItem[] }) {
  if (!chartData || chartData.length === 0) return <p>No data for bar chart.</p>;
  return <BarChartView chartData={chartData} />;
}
