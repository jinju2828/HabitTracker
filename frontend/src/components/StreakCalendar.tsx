import "../styles/StreakCalendar.css";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Props {
  completedByDate: Record<string, number>;
  dailyGoal: number;
  year: number;
  month: number; // 0-based
}

export default function StreakCalendar({
  completedByDate,
  dailyGoal,
  year,
  month,
}: Props) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startWeekday = firstDay.getDay(); // 0 (Sun) ~ 6 (Sat)
  const totalDays = lastDay.getDate();

  const calendarCells: {
    date?: string;
    completed?: boolean;
  }[] = [];

  // 🔹 앞쪽 padding (빈 칸)
  for (let i = 0; i < startWeekday; i++) {
    calendarCells.push({});
  }

  // 🔹 실제 날짜
  for (let day = 1; day <= totalDays; day++) {
    const d = new Date(year, month, day);
    const dateStr = d.toLocaleDateString("en-CA");

    const completed = (completedByDate[dateStr] || 0) >= dailyGoal;

    calendarCells.push({ date: dateStr, completed });
  }

  const todayStr = new Date().toLocaleDateString("en-CA");

  return (
    <div className="streak-calendar-wrapper">
      {/* 🔹 요일 헤더 */}
      <div className="weekday-header">
        {WEEKDAYS.map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      {/* 🔹 캘린더 */}
      <div className="streak-calendar">
        {calendarCells.map((cell, idx) => {
          if (!cell.date) {
            return <div key={idx} className="calendar-day empty" />;
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
  );
}
