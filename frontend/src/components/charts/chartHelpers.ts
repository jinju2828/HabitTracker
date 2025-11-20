// chartHelpers.ts
import { parseISO, format, isAfter } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const timeZone = "America/Los_Angeles";

export type CustomDatum = {
  x: string;
  y: number;
  fullDate: string;
};


export interface PreparedChartItem {
  fullDate: string; // YYYY-MM-DD
  y: number;        // 1, 0, -1
}

/**
 * chartData: [{date: '2025-01-01', completed: 1}]
 * completed:  
 *   1 = completed  
 *   0 = missed  
 *  -1 = future → Not yet
 */
export const prepareChartData = (
  rawData: { date: string; completed: number }[]
): PreparedChartItem[] => {
  const today = new Date();

  return rawData.map((item) => {
    const parsed = parseISO(item.date);

    const isFuture = isAfter(parsed, today);

    return {
      fullDate: item.date,
      y: isFuture ? -1 : item.completed
    };
  });
};

export const prepareHeatmapData = (
  chartData: { date: string; completed: number }[]
) => {
  const weeks: Record<string, Record<string, CustomDatum>> = {};

  chartData.forEach(({ date, completed }) => {
    const zoned = toZonedTime(parseISO(date), timeZone);

    const weekKey = format(zoned, "'W'w");
    const dayName = format(zoned, "EEE"); // Mon, Tue, ...
    const fullDate = format(zoned, "yyyy-MM-dd");

    if (!weeks[weekKey]) weeks[weekKey] = {};

    weeks[weekKey][dayName] = {
      x: dayName,
      y: completed,
      fullDate,
    };
  });

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return Object.entries(weeks).map(([id, week]) => ({
    id,
    data: days.map((day) =>
      week[day] ?? { x: day, y: 0, fullDate: "" }
    ),
  }));
};
