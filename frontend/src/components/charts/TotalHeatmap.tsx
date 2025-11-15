import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekOfYear); // 이거 꼭 추가!

interface HabitLog {
  log_date: string;
  completed: boolean;
}

interface TotalHeatmapProps {
  allLogs: HabitLog[];
}

export const TotalHeatmap: React.FC<TotalHeatmapProps> = ({ allLogs }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(dayjs().month());

  // 1) 날짜별 완료 개수
  const dailyCount = useMemo(() => {
    const map: Record<string, number> = {};
    allLogs.forEach((log) => {
      const date = dayjs(log.log_date).format("YYYY-MM-DD");
      if (!map[date]) map[date] = 0;
      if (log.completed) map[date] += 1;
    });
    return map;
  }, [allLogs]);

  // 2) 선택한 달 날짜 목록
  const monthDates = useMemo(() => {
    const daysInMonth = dayjs().month(selectedMonth).daysInMonth();
    return Array.from({ length: daysInMonth }, (_, i) =>
      dayjs().month(selectedMonth).date(i + 1).format("YYYY-MM-DD")
    );
  }, [selectedMonth]);

  // 3) 색상 단계
  const getColor = (count: number) => {
    if (count === 0) return "#ebedf0";
    if (count === 1) return "#c6e48b";
    if (count === 2) return "#7bc96f";
    if (count === 3) return "#239a3b";
    return "#196127";
  };

  // 4) 요일별로 배치
  const weeks = useMemo(() => {
    const weekMap: Record<number, { date: string; count: number }[]> = {};
    monthDates.forEach((dateStr) => {
      const date = dayjs(dateStr);
      const weekNum = date.week();
      if (!weekMap[weekNum]) weekMap[weekNum] = [];
      weekMap[weekNum].push({
        date: dateStr,
        count: dailyCount[dateStr] || 0,
      });
    });
    return Object.values(weekMap);
  }, [monthDates, dailyCount]);

  const months = Array.from({ length: 12 }, (_, i) => ({
    label: dayjs().month(i).format("MMMM"),
    value: i,
  }));

  return (
    <div className="flex flex-col gap-4">
      {/* Month Selector */}
      <div className="flex justify-end mb-2">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="border rounded px-3 py-1 text-sm"
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Heatmap */}
      <div className="flex flex-col gap-1">
        {weeks.map((week, i) => (
          <div key={i} className="flex gap-1">
            {Array.from({ length: 7 }).map((_, j) => {
              const day = week[j];
              return (
                <div
                  key={j}
                  title={day ? `${day.date}: ${day.count} habits` : ""}
                  style={{
                    width: 14,
                    height: 14,
                    backgroundColor: day ? getColor(day.count) : "#ebedf0",
                    borderRadius: 3,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
