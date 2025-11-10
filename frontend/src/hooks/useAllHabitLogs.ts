import { useState, useEffect } from 'react';
import type { HabitLog } from '../utils/types';
import { useHabits } from './useHabits';
import { useHabitLogs } from './useHabitLogs';

export const useAllHabitLogs = () => {
  const { habits } = useHabits();
  const [allLogs, setAllLogs] = useState<HabitLog[]>([]);

  useEffect(() => {
    const fetchAllLogs = async () => {
      const logsPromises = habits.map(async (habit) => {
        const { logs, fetchLogs } = useHabitLogs(habit.id);
        await fetchLogs();
        return logs;
      });

      const resolvedLogs = await Promise.all(logsPromises);
      setAllLogs(resolvedLogs.flat());
    };

    if (habits.length > 0) fetchAllLogs();
  }, [habits]);

  return allLogs;
};
