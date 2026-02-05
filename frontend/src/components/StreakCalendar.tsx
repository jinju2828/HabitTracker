import "../styles/StreakCalendar.css";

interface Props {
  completedByDate: Record<string, number>;
  dailyGoal: number;
  year?: number;
  month?: number; // 0-based
}

export default function StreakCalendar({
  completedByDate,
  dailyGoal,
  year,
  month,
}: Props) {
  const today = new Date();
  const calendarDays: { date: string; completed: boolean }[] = [];

  if (year !== undefined && month !== undefined) {
    // 🔹 월별 캘린더
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(year, month, day);
      const dateStr = d.toLocaleDateString("en-CA");

      const completed = (completedByDate[dateStr] || 0) >= dailyGoal;
      calendarDays.push({ date: dateStr, completed });
    }
  } else {
    // 🔹 최근 N일 (기존 로직)
    const days = 35;

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const dateStr = d.toLocaleDateString("en-CA");
      const completed = (completedByDate[dateStr] || 0) >= dailyGoal;

      calendarDays.push({ date: dateStr, completed });
    }
  }

  return (
    <div className="streak-calendar">
      <div className="this-month">
        {year === undefined || month === undefined ? "Last 35 Days" :
        `${year}-${(month + 1).toString().padStart(2, "0")}`}
      </div>
      {calendarDays.map((day) => {
        const isToday =
          day.date === new Date().toLocaleDateString("en-CA");

        return (
          <div
            key={day.date}
            className={`calendar-day
              ${day.completed ? "done" : ""}
              ${isToday ? "today" : ""}
            `}
          >
            <div className="date">{day.date.slice(8)}</div>
            <div className="icon">{day.completed ? "🔥" : "○"}</div>
          </div>
        );
      })}
    </div>
  );
}
