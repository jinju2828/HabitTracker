import { eachDayOfInterval, startOfMonth, endOfMonth, getWeek, getDay } from "date-fns";

export function generateMonthHeatmapData(year: number, month: number) {
  const start = startOfMonth(new Date(year, month - 1));
  const end = endOfMonth(start);

  const allDays = eachDayOfInterval({ start, end });

  // 주 인덱스 계산 (해 같은 달 기준으로 normalize)
  const firstWeek = getWeek(start);

  const weekMap: Record<number, { id: number; data: { x: number; y: number }[] }> = {};

  allDays.forEach((date) => {
    const weekIndex = getWeek(date) - firstWeek;
    const dayOfWeek = getDay(date); // 0: Sun ~ 6: Sat

    if (!weekMap[weekIndex]) {
      weekMap[weekIndex] = {
        id: weekIndex,
        data: [],
      };
    }

    weekMap[weekIndex].data.push({
      x: dayOfWeek,                    // 요일
      y: Math.floor(Math.random() * 5) // 임시값 (여기 데이터 넣으면 됨)
    });
  });

  return Object.values(weekMap);
}
