import React, { useMemo, useState } from "react";
import dayjs from "dayjs";

interface HabitLog {
  log_date: string; // "yyyy-MM-DD"
  completed: number;
}

interface Props {
  allLogs: HabitLog[];
}

export const TotalHeatmap: React.FC<Props> = ({ allLogs }) => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month());

  const today = dayjs();

  // 1) 날짜별 완료 개수 계산
  const dailyCount = useMemo(() => {
    const map: Record<string, number> = {};
    allLogs.forEach((l) => {
      if (!l.completed) return;
      const dateKey = dayjs(l.log_date).format("YYYY-MM-DD");
      if (!map[dateKey]) map[dateKey] = 0;
      map[dateKey] += 1;
    });
    return map;
  }, [allLogs]);

  // 2) 달력식 주차 배열 생성
  const weeks = useMemo(() => {
    const firstDayOfMonth = dayjs().month(selectedMonth).startOf("month").startOf("week");
    const lastDayOfMonth = dayjs().month(selectedMonth).endOf("month").endOf("week");

    const days: dayjs.Dayjs[] = [];
    let curr = firstDayOfMonth;
    while (curr.isBefore(lastDayOfMonth) || curr.isSame(lastDayOfMonth, "day")) {
      days.push(curr);
      curr = curr.add(1, "day");
    }

    const weekMap: dayjs.Dayjs[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weekMap.push(days.slice(i, i + 7));
    }

    return weekMap;
  }, [selectedMonth]);

  // 3) 색상 단계 (GitHub style)
  const getColor = (count: number) => {
    if (count === 0) return "#ebedf0";
    if (count === 1) return "#c6e48b";
    if (count === 2) return "#7bc96f";
    if (count === 3) return "#239a3b";
    return "#196127";
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

      {/* Weekday header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 30px)",
          gap: "4px",
          justifyContent: "center",
          fontSize: 12,
          textAlign: "center",
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Heatmap grid (with tooltip) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 30px)",
          gap: "4px",
          justifyContent: "center",
        }}
      >
        {weeks.map((week, wi) =>
          week.map((day) => {
            const dateKey = day.format("YYYY-MM-DD");
            const count = dailyCount[dateKey] || 0;

            return (
              <div
                key={dateKey}
                title={`${dateKey}\n습관 ${count}개 완료`}
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: getColor(count),
                  borderRadius: 4,
                  border: "1px solid #fff",
                  cursor: "pointer",
                  transition: "transform 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
