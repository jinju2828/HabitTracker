import React, { useEffect, useState } from "react";
import { HabitChartType } from "./HabitChartType";
import type { Habit, HabitLog } from "../utils/types";
import { getHabits } from "@/api/habitApi"; // ✅ interceptor 붙은 api 사용

interface Props {
  allLogs: HabitLog[];
}

export const HabitProgressChart: React.FC<Props> = ({ allLogs }) => {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const loadHabits = async () => {
      try {
        const data = await getHabits();
        setHabits(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadHabits();
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
        gap: 24,
      }}
    >
      {habits.map((habit) => {
        const habitLogs = allLogs
          .filter((log) => log.habit_id === habit.id)
          .map((l) => ({
            date: l.log_date.slice(0, 10),
            completed: l.completed ? 1 : 0,
          }))
          .sort((a, b) => a.date.localeCompare(b.date));

        return (
          <div
            key={habit.id}
            style={{
              padding: 16,
              borderRadius: 12,
              background: "#fafafa",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              color: "#333",
            }}
          >
            <h3 style={{ marginBottom: 8, marginTop: 0 }}>
              {habit.name}
            </h3>

            <HabitChartType habitLogs={habitLogs} />
          </div>
        );
      })}
    </div>
  );
};