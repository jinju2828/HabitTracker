import { useEffect, useState } from "react";
import { useHabits } from "./useHabits";
import { fetchHabitLogs } from "./useHabitLogs";
import type { HabitLog } from "@/utils/types";

// ✅ 모든 습관의 로그를 병합해서 반환
export const useAllHabitLogs = () => {
  const { habits } = useHabits();
  const [allLogs, setAllLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          habits.map(async (habit) => {
            const logs = await fetchHabitLogs(habit.id);
            return logs;
          })
        );
        setAllLogs(results.flat());
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
