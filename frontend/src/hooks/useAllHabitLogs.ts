import { useState, useEffect } from 'react';
import axios from 'axios';
import { useHabits } from './useHabits';
import type { HabitLog } from '../utils/types';

export const useAllHabitLogs = () => {
  const { habits } = useHabits();
  const [allLogs, setAllLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const logsArr: HabitLog[][] = await Promise.all(
        habits.map(async (habit) => {
          const res = await axios.get<HabitLog[]>(`/habit-logs/${habit.id}`);
          // 날짜 정규화
          return res.data.map(l => ({ ...l, log_date: l.log_date.slice(0, 10) }));
        })
      );
      setAllLogs(logsArr.flat());
      setLoading(false);
    };

    if (habits.length) fetchLogs();
  }, [habits]);

  return { allLogs, loading };
};
