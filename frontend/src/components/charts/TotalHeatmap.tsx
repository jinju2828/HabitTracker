import React, { useMemo } from "react";
import dayjs from "dayjs";

interface HabitLog {
  log_date: string;
  completed: number; // 개수!
}

interface Props {
  allLogs: HabitLog[];
  selectedMonth: number;
}

export const TotalHeatmap: React.FC<Props> = ({ allLogs, selectedMonth }) => {
  /** 날짜별 완료 개수 맵 */
  const dailyCount = useMemo(() => {
    const map: Record<string, number> = {};
    allLogs.forEach((l) => {
      const dateKey = dayjs(l.log_date).format("YYYY-MM-DD");
      map[dateKey] = (map[dateKey] ?? 0) + Number(l.completed || 0);
    });
    return map;
  }, [allLogs]);

  /** 달력처럼 주 단위 배열 만들기 */
  const weeks = useMemo(() => {
    const first = dayjs().month(selectedMonth).startOf("month").startOf("week");
    const last = dayjs().month(selectedMonth).endOf("month").endOf("week");

    const days: dayjs.Dayjs[] = [];
    let cur = first;

    while (cur.isBefore(last) || cur.isSame(last, "day")) {
      days.push(cur);
      cur = cur.add(1, "day");
    }

    const weekMap: dayjs.Dayjs[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weekMap.push(days.slice(i, i + 7));
    }

    return weekMap;
  }, [selectedMonth]);

  /** 색상 단계 */
  const getColor = (count: number) => {
    if (count === 0) return "#ebedf0";
    if (count === 1) return "#c6e48b";
    if (count === 2) return "#7bc96f";
    if (count === 3) return "#239a3b";
    return "#196127";
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 요일 */}
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

      {/* 히트맵 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 30px)",
          gap: "4px",
          justifyContent: "center",
        }}
      >
        {weeks.map((week) =>
          week.map((day) => {
            const key = day.format("YYYY-MM-DD");
            const count = dailyCount[key] ?? 0;

            return (
              <div
                key={key}
                title={`${key}\n습관 ${count}개 완료`}
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
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "scale(1)";
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
