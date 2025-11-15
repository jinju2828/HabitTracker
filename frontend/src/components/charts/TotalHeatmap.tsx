import React, { useMemo, useState } from "react";
import dayjs from "dayjs";

interface HabitLog {
  log_date: string; // "yyyy-MM-DD"
  completed: boolean;
}

interface Props {
  allLogs: HabitLog[];
}

export const TotalHeatmap: React.FC<Props> = ({ allLogs }) => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month());

  // 1) 월별 날짜 배열
  const monthDays = useMemo(() => {
    const start = dayjs().month(selectedMonth).startOf("month");
    const end = dayjs().month(selectedMonth).endOf("month");
    const days: dayjs.Dayjs[] = [];
    let curr = start;
    while (curr.isBefore(end) || curr.isSame(end, "day")) {
      days.push(curr);
      curr = curr.add(1, "day");
    }
    return days;
  }, [selectedMonth]);

  // 2) 날짜별 완료 개수 계산
  const dailyCount = useMemo(() => {
    const map: Record<string, number> = {};
    allLogs.forEach((l) => {
      if (!l.completed) return;
      const dateKey = dayjs(l.log_date).format("YYYY-MM-DD");
      if (!map[dateKey]) map[dateKey] = 0;
      map[dateKey] += 1;
    });
    return map; // { "2025-11-01": 2, ... }
  }, [allLogs]);

  // 3) 주 단위로 그룹화
  const weeks = useMemo(() => {
    const map: Record<number, dayjs.Dayjs[]> = {};
    const firstDayOfMonth = dayjs().month(selectedMonth).startOf("month").startOf("week");

    monthDays.forEach((day) => {
      const weekIndex = day.startOf("week").diff(firstDayOfMonth, "week");
      if (!map[weekIndex]) map[weekIndex] = [];
      map[weekIndex].push(day);
    });

    return map;
  }, [monthDays, selectedMonth]);

  // 4) 색상 단계 (GitHub style)
  const getColor = (count: number) => {
    if (count === 0) return "#ebedf0"; // 연한 회색
    if (count === 1) return "#c6e48b";
    if (count === 2) return "#7bc96f";
    if (count === 3) return "#239a3b";
    return "#196127"; // 4 이상
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    label: dayjs().month(i).format("MMMM"),
    value: i,
  }));

  return (
    <div className="flex flex-col gap-4">
      {/* Month selector */}
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
      <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(7, 30px)" }}>
        {/* 요일 헤더 */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} style={{ fontSize: 12, textAlign: "center" }}>
            {d}
          </div>
        ))}

        {/* 날짜 칸 */}
        {Object.values(weeks).map((week) =>
          week.map((day) => {
            const dateKey = day.format("YYYY-MM-DD");
            const count = dailyCount[dateKey] || 0;
            return (
              <div
                key={dateKey}
                title={`${dateKey} — ${count} habits`}
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: getColor(count),
                  borderRadius: 4,
                  border: "1px solid #fff",
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
