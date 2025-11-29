import React, { useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

interface HabitLog {
  log_date: string; // "YYYY-MM-DD" (or ISO)
  completed: number; // total completed count for that date (0,1,2,...)
}

interface Props {
  allLogs: HabitLog[];      // 전체 로그(합산된 daily counts or raw logs aggregated upstream)
  selectedYear: number;     // ex: 2025
  selectedMonth: number;    // 1..12
  // optional square size
  cellSize?: number;
}

const GREEN_PALETTE = [
  "#ebedf0", // 0
  "#c6e48b", // 1
  "#7bc96f", // 2
  "#239a3b", // 3
  "#196127", // 4+
];

const clampCountToIndex = (count: number) => {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
};

export default function TotalHeatmap({
  allLogs,
  selectedYear,
  selectedMonth,
  cellSize = 18,
}: Props) {
  // 1) build map of date -> count (ensure key is "YYYY-MM-DD")
  const dailyCountMap = useMemo(() => {
    const m: Record<string, number> = {};
    allLogs.forEach((l) => {
      // try parse as UTC-safe date
      const key = dayjs.utc(l.log_date).format("YYYY-MM-DD");
      m[key] = (m[key] || 0) + (typeof l.completed === "number" ? l.completed : Number(l.completed));
    });
    return m;
  }, [allLogs]);

  // 2) compute month calendar grid (weeks as rows)
  const { weeks, monthLabel } = useMemo(() => {
    const start = dayjs.utc(`${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`).startOf("month");
    const end = start.endOf("month");
    // startOf('week') -> Sunday as start (default)
    const first = start.startOf("week");
    const last = end.endOf("week");

    const days: dayjs.Dayjs[] = [];
    let cur = first;
    while (cur.isBefore(last) || cur.isSame(last, "day")) {
      days.push(cur);
      cur = cur.add(1, "day");
    }

    // chunk into weeks (rows)
    const weeksArr: dayjs.Dayjs[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeksArr.push(days.slice(i, i + 7));
    }

    return {
      weeks: weeksArr,
      monthLabel: start.format("YYYY MMMM"),
    };
  }, [selectedYear, selectedMonth]);

  // helper color
  const getColor = (count: number) => GREEN_PALETTE[clampCountToIndex(count)];

  // inline styles (keeps everything self-contained)
  const containerStyle: React.CSSProperties = {
    display: "inline-block",
    padding: 8,
    borderRadius: 6,
    background: "#fff",
    margin: "0 auto" 
  };
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridAutoRows: `${cellSize}px`,
    gap: 6,
    justifyContent: "center",
  };
  const weekRowStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(7, ${cellSize}px)`,
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties;

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <div style={containerStyle}>
      <div style={{ marginBottom: 8, fontSize: 13, color: "#222" }}>{monthLabel}</div>

      {/* Weekday header */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(7, ${cellSize}px)`, gap: 6, marginBottom: 6, fontSize: 11, color: "#666", textAlign: "center",  justifyContent: "center" }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} style={{ width: cellSize }}>{d}</div>
        ))}
      </div>

      {/* Weeks rows */}
      <div style={gridStyle}>
        {weeks.map((week, wi) => (
          <div key={wi} style={weekRowStyle}>
            {week.map((day) => {
              const iso = day.format("YYYY-MM-DD");
              const inMonth = day.month() + 1 === selectedMonth && day.year() === selectedYear;
              const count = dailyCountMap[iso] ?? 0;
              const color = inMonth ? getColor(count) : "#f6f6f6"; // out-of-month cells muted
              const title = `${iso} — ${inMonth ? `${count} habit(s) completed` : "not in month"}`;

              return (
                <div
                  key={iso}
                  title={title}
                  role="button"
                  aria-label={title}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    background: color,
                    borderRadius: 4,
                    border: inMonth ? "1px solid #fff" : "1px solid #f0f0f0",
                    boxSizing: "border-box",
                    display: "inline-block",
                    cursor: inMonth ? "pointer" : "default",
                    transition: "transform 120ms ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "scale(1.06)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* legend */}
      <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: "#444" }}>
        <div style={{ marginRight: 8 }}>Less → More</div>
        {GREEN_PALETTE.map((c, i) => (
          <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 14, height: 14, background: c, borderRadius: 3, border: "1px solid #fff" }} />
            <div style={{ fontSize: 11, color: "#666" }}>{i === 4 ? "4+" : i}</div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
