declare module "react-calendar-heatmap" {
  import * as React from "react";

  export interface HeatmapValue {
    date: string;
    count?: number;
  }

  export interface CalendarHeatmapProps {
    startDate: string | Date;
    endDate: string | Date;
    values: HeatmapValue[];
    classForValue?: (value: HeatmapValue | null) => string;
    tooltipDataAttrs?: (value: HeatmapValue | null) => object;
    showWeekdayLabels?: boolean;
  }

  export default class CalendarHeatmap extends React.Component<
    CalendarHeatmapProps
  > {}
}
