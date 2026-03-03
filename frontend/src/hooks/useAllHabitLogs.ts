import { useEffect, useState, useCallback } from "react";
import { useHabits } from "./useHabits";
import { fetchHabitLogs } from "./useHabitLogs";
import type { HabitLog } from "@/utils/types";

export const useAllHabitLogs = () => {
  const { habits } = useHabits();
  const [allLogs, setAllLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    if (habits.length === 0) return;   // 🔥 핵심 추가

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
  }, [habits]);

  useEffect(() => {
    fetchLogs();   // 🔥 habits 변경되면 항상 실행
  }, [fetchLogs]);

  return { allLogs, loading, refetch: fetchLogs };
};