import React from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";

interface HeatmapChartViewProps {
  data: {
    id: string;
    data: {
      x: string;
      y: number;
    }[];
  }[];
}

export const HeatmapChartView: React.FC<HeatmapChartViewProps> = ({ data }) => {
  return (
    <div style={{ height: 400 }}>
      <ResponsiveHeatMap
        data={data}
        margin={{ top: 40, right: 60, bottom: 60, left: 60 }}
        valueFormat=">-.2f"
        colors={{
          type: "sequential",
          scheme: "greens",
        }}
        emptyColor="#f5f5f5"
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.8]],
        }}
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
        }}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
        }}
        tooltip={({ cell }) => (
          <div
            style={{
              background: "white",
              padding: "6px 9px",
              border: "1px solid #ccc",
            }}
          >
            <strong>
              {cell.serieId} / {cell.data.x}: {cell.data.y}
            </strong>
          </div>
        )}
      />
    </div>
  );
};
