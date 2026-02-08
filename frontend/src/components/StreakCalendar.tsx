import { useState } from "react";
import "../styles/StreakCalendar.css";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface Props {
  completedByDate: Record<string, number>;
  dailyGoal: number;
}

export default function StreakCalendar({
  completedByDate,
  dailyGoal,
}: Props) {
  const today = new Date();
  const todayStr = today.toLocaleDateString("en-CA");

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [direction, setDirection] = useState<"prev" | "next">("next");

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startWeekday = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const cells: { date?: string; completed?: boolean }[] = [];

  // padding
  for (let i = 0; i < startWeekday; i++) cells.push({});

  // days
  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(year, month, d);
    const dateStr = date.toLocaleDateString("en-CA");
    cells.push({
      date: dateStr,
      completed: (completedByDate[dateStr] || 0) >= dailyGoal,
    });
  }

  const goPrevMonth = () => {
    setDirection("prev");
    month === 0 ? (setMonth(11), setYear(y => y - 1)) : setMonth(m => m - 1);
  };

  const goNextMonth = () => {
    setDirection("next");
    month === 11 ? (setMonth(0), setYear(y => y + 1)) : setMonth(m => m + 1);
  };

  return (
    <div className="streak-calendar-wrapper">
      {/* Header */}
      <div className="calendar-header">
        <button onClick={goPrevMonth}>◀</button>
        <div className="month-title">
          {MONTHS[month]} {year}
        </div>
        <button onClick={goNextMonth}>▶</button>
      </div>

      {/* Weekdays */}
      <div className="weekday-header">
        {WEEKDAYS.map(d => (
          <div key={d} className="weekday">{d}</div>
        ))}
      </div>

      {/* Calendar Body (animated) */}
      <div
        className={`calendar-body slide-${direction}`}
        key={`${year}-${month}`}
      >
        <div className="calendar-grid">
          {cells.map((cell, i) => {
            if (!cell.date) {
              return <div key={i} className="calendar-day empty" />;
            }

            const isToday = cell.date === todayStr;

            return (
              <div
                key={cell.date}
                className={`calendar-day
                  ${cell.completed ? "done" : ""}
                  ${isToday ? "today" : ""}
                `}
              >
                <div className="date">{cell.date.slice(8)}</div>
                <div className="icon">
                  {cell.completed ? "🔥" : "○"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
