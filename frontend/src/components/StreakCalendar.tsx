interface Props {
  completedByDate: Record<string, number>;
  dailyGoal: number;
  days?: number;
}

export default function StreakCalendar({
  completedByDate,
  dailyGoal,
  days = 30,
}: Props) {
  const today = new Date();

  const calendarDays = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const dateStr = d.toLocaleDateString("en-CA");
    const completed = (completedByDate[dateStr] || 0) >= dailyGoal;

    calendarDays.push({ date: dateStr, completed });
  }

  return (
    <div className="streak-calendar">
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
            <div className="date">{day.date.slice(5)}</div>
            <div className="icon">
              {day.completed ? "🔥" : "○"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
