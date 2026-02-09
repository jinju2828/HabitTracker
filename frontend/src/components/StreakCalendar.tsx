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

interface CalendarCell {
  date?: string;
  completed?: boolean;
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

  const calendarCells: CalendarCell[] = [];

  // 🔹 padding
  for (let i = 0; i < startWeekday; i++) {
    calendarCells.push({});
  }

  // 🔹 days
  for (let day = 1; day <= totalDays; day++) {
    const d = new Date(year, month, day);
    const dateStr = d.toLocaleDateString("en-CA");
    const completed = (completedByDate[dateStr] || 0) >= dailyGoal;

    calendarCells.push({
      date: dateStr,
      completed,
    });
  }

  // 🔹 month navigation
  const goPrevMonth = () => {
    setDirection("prev");
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    setDirection("next");
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <div
      className={`streak-calendar-wrapper slide-${direction}`}
      key={`${year}-${month}`} // ⭐ slide animation 트리거
    >
      {/* 🔹 Month Header */}
      <div className="calendar-header">
        <button onClick={goPrevMonth}>◀</button>
        <div className="month-title">
          {MONTHS[month]} {year}
        </div>
        <button onClick={goNextMonth}>▶</button>
      </div>

      {/* 🔹 Weekdays */}
      <div className="weekday-header">
        {WEEKDAYS.map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      {/* 🔹 Calendar Grid */}
      <div className="calendar-grid">
        {calendarCells.map((cell, idx) => {
          if (!cell.date) {
            return <div key={idx} className="calendar-day empty" />;
          }

          const isToday = cell.date === todayStr;

          const prev = calendarCells[idx - 1];
          const next = calendarCells[idx + 1];

          const streakLeft =
            cell.completed && prev?.completed && prev?.date;

          const streakRight =
            cell.completed && next?.completed && next?.date;

          return (
            <div
              key={cell.date}
              className={`calendar-day
                ${cell.completed ? "done" : ""}
                ${isToday ? "today" : ""}
                ${streakLeft ? "streak-left" : ""}
                ${streakRight ? "streak-right" : ""}
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
  );
}
