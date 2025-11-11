// ✅ useAllHabitLogs.ts
import { useEffect, useState } from "react";
import { useHabitLogs } from "./useHabitLogs";
import type { HabitLog } from "@/utils/types";
import { useHabits } from "./useHabits";

export const useAllHabitLogs = () => {
  const { habits } = useHabits();
  const [allLogs, setAllLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('here')
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          habits.map(async (habit) => {
            const { logs } = await useHabitLogs(habit.id);
            return logs; // ✅ log_date 그대로 유지
          })
        );
        setAllLogs(results.flat());
        console.log('results', results);
      } catch (err) {
        console.error("Failed to fetch all logs", err);
      } finally {
        setLoading(false);
      }
    };

    if (habits.length > 0) fetchLogs();
  }, [habits]);

  return { allLogs, loading };
};
