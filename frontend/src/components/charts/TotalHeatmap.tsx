// TotalHeatmap.tsx
import React, { useMemo } from "react";
import dayjs from "dayjs";

interface HabitLog {
  log_date: string; // YYYY-MM-DD
  completed: number;
}

interface Props {
  allLogs: HabitLog[];
  selectedYear: number;
  selectedMonth: number;
  cellSize?: number;
}

const GREEN_PALETTE = ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"];
const clampCountToIndex = (count: number) => Math.min(Math.max(count, 0), 4);

export default function TotalHeatmap({ allLogs, selectedYear, selectedMonth, cellSize = 18 }: Props) {
  const dailyCountMap = useMemo(() => {
    const m: Record<string, number> = {};
    allLogs.forEach((l) => {
      m[l.log_date] = (m[l.log_date] || 0) + l.completed;
    });
    return m;
  }, [allLogs]);

  const { weeks, monthLabel } = useMemo(() => {
    const start = dayjs(`${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`).startOf("month");
    const end = start.endOf("month");
    const first = start.startOf("week");
    const last = end.endOf("week");

    const days: dayjs.Dayjs[] = [];
    let cur = first;
    while (cur.isBefore(last) || cur.isSame(last, "day")) {
      days.push(cur);
      cur = cur.add(1, "day");
    }

    const weeksArr: dayjs.Dayjs[][] = [];
    for (let i = 0; i < days.length; i += 7) weeksArr.push(days.slice(i, i + 7));
    return { weeks: weeksArr, monthLabel: start.format("YYYY MMMM") };
  }, [selectedYear, selectedMonth]);

  const getColor = (count: number) => GREEN_PALETTE[clampCountToIndex(count)];

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ padding: 8, borderRadius: 6, background: "#fff" }}>
        <div style={{ marginBottom: 8, fontSize: 13, color: "#222" }}>{monthLabel}</div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(7, ${cellSize}px)`, gap: 6, marginBottom: 6, fontSize: 11, color: "#666", textAlign: "center" }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} style={{ width: cellSize }}>{d}</div>)}
        </div>
        <div style={{ display: "grid", gridAutoRows: `${cellSize}px`, gap: 6 }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: "grid", gridTemplateColumns: `repeat(7, ${cellSize}px)`, gap: 6 }}>
              {week.map((day) => {
                const iso = day.format("YYYY-MM-DD");
                const inMonth = day.month() + 1 === selectedMonth && day.year() === selectedYear;
                const count = dailyCountMap[iso] ?? 0;
                const color = inMonth ? getColor(count) : "#f6f6f6";
                const title = `${iso} — ${inMonth ? `${count} habit(s) completed` : "not in month"}`;
                return <div key={iso} title={title} style={{ width: cellSize, height: cellSize, background: color, borderRadius: 4, border: inMonth ? "1px solid #fff" : "1px solid #f0f0f0" }} />;
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
