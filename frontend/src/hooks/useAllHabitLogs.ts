import { useEffect, useState } from "react";
import { useHabits } from "./useHabits";
import { fetchHabitLogs } from "./useHabitLogs";
import type { HabitLog } from "@/utils/types";

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
            const logs = await fetchHabitLogs(habit.id); // 정확한 백엔드 URL 사용
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
