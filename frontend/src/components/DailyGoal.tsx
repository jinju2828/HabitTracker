import { useDailyGoal } from "../context/DailyGoalContext";
import "../styles/DailyGoal.css";
import InputDailyGoal from "./InputDailyGoal";

interface HabitLog {
  log_date: string;
  completed: boolean;
}

interface Props {
  allLogs: HabitLog[];
}

export default function DailyGoal({ allLogs }: Props) {
  const { dailyGoal } = useDailyGoal();
  const todayLocal = new Date().toLocaleDateString("en-CA");

  const todayCompletedCount = allLogs.filter(
    (log) => log.log_date.slice(0, 10) === todayLocal && log.completed
  ).length;

  const progress = Math.min(
    Math.round((todayCompletedCount / dailyGoal) * 100),
    100
  );

  return (
    <div className="daily-goal">
      <h3>Daily Goal</h3>

      <InputDailyGoal />

      <p>
        {todayCompletedCount} / {dailyGoal} completed
      </p>

      {/* 🔹 Progress Bar */}
      <div className="progress-chart">
        <div className="progress-bar">
          <div
            className={`progress-fill ${progress >= 100 ? "done" : ""}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="progress-text">You've done {progress}% of today's goal!</div>
      </div>

      {progress >= 100 && <p className="goal-done">🎉 Goal achieved!</p>}
    </div>
  );
}
