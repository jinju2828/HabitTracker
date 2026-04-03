import { useHabits } from "@/hooks/useHabits";
import { useDailyGoal } from "../context/UserProfileContext";
import "../styles/DailyGoal.css";
import InputDailyGoal from "./InputDailyGoal";
import StreakCalendar from "./StreakCalendar";

interface HabitLog {
  log_date: string;
  completed: boolean;
}

interface Props {
  allLogs: HabitLog[];
}

export default function DailyGoal({ allLogs }: Props) {
  const { dailyGoal } = useDailyGoal();
  const { habits } = useHabits();
  const habitsExist = habits.length > 0;

  if (dailyGoal > habits.length && habitsExist) {
    return (
      <div className="daily-goal">
        <InputDailyGoal />
        <p>Your daily goal exceeds the number of habits you have. 
        <br /> Please adjust your daily goal or add more habits.</p>
      </div>
    );  
  }

  const todayLocal = new Date().toLocaleDateString("en-CA");

  const todayCompletedCount = allLogs.filter(
    (log) => log.log_date.slice(0, 10) === todayLocal && log.completed
  ).length;

  const progress = Math.min(
    Math.round((todayCompletedCount / dailyGoal) * 100),
    100
  );

  const completedByDate: Record<string, number> = {};

  allLogs.forEach((log) => {
    if (!log.completed) return;

    const date = log.log_date.slice(0, 10); // YYYY-MM-DD
    completedByDate[date] = (completedByDate[date] || 0) + 1;
  });

  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();

    const todayCompleted = completedByDate[todayLocal] || 0;
    const startOffset = todayCompleted >= dailyGoal ? 0 : 1;

    for (let i = startOffset; ; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const dateStr = d.toLocaleDateString("en-CA");
      const completedCount = completedByDate[dateStr] || 0;

      if (completedCount >= dailyGoal) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };


  const streak = calculateStreak();


  const calculateLongestStreak = () => {
    const dates = Object.keys(completedByDate).sort(); // YYYY-MM-DD 정렬
    let longest = 0;
    let current = 0;
    let prevDate: Date | null = null;

    for (const dateStr of dates) {
      const completedCount = completedByDate[dateStr];

      if (completedCount < dailyGoal) {
        current = 0;
        prevDate = null;
        continue;
      }

      const currentDate = new Date(dateStr);

      if (prevDate) {
        const diff =
          (currentDate.getTime() - prevDate.getTime()) /
          (1000 * 60 * 60 * 24);

        if (diff === 1) {
          current += 1;
        } else {
          current = 1;
        }
      } else {
        current = 1;
      }

      longest = Math.max(longest, current);
      prevDate = currentDate;
    }

    return longest;
  };

  const longestStreak = calculateLongestStreak();

  const isCompletedToday = todayCompletedCount >= dailyGoal;

  return (
    <div className="daily-goal">

     {habitsExist && (
      <>
        <InputDailyGoal />

        <div className="daily-goal-summary">
          <span>
            {todayCompletedCount} / {dailyGoal} completed today.{" "}
          </span>
          <div className="progress-text">You've done {progress}% of today's goal!</div>
          <div className="progress-text"> See your progress below </div>
        </div>

        <div className="progress-chart">
          <div className="progress-bar">
            <div
              className={`progress-fill ${progress >= 100 ? "done" : ""}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {progress >= 100 && <p className="goal-done">🎉 Goal achieved!</p>}
      </>
    )}
      
      <StreakCalendar
        completedByDate={completedByDate}
        dailyGoal={dailyGoal}
      />

      <div className="streak-box">
        <span className="streak-fire">{isCompletedToday ? "😊" : "😰"}</span>
        <div className="streak-info">
          <strong>{streak} day streak</strong>
          <div className="streak-sub">
            {isCompletedToday
              ? "You're on fire today 🔥"
              : "Complete today's goal to extend your streak!"}
          </div>
          <div className="longest-streak-message">
            {/* If user finishes today's goal, and if today's streak is greater than longest streak */}
            {streak === longestStreak && streak > 0 && isCompletedToday
              ? "This is your longest streak!"
              : ""}
          </div>
          <div className="longest-streak">
            Longest streak: {longestStreak} days 🏆
          </div>

        </div>
      </div>

    </div>
  );
}
