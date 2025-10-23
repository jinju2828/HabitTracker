import { useState, useEffect } from 'react';
import type { HabitLog } from '@/api/habitLogsApi';
import { getHabitLogs, createHabitLog, updateHabitLog } from '@/api/habitLogsApi';

export const useHabitLogs = (habitId: number) => {
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    const data = await getHabitLogs(habitId);
    setLogs(data);
    setLoading(false);
  };

  const addLog = async (date: string, completed = false) => {
    await createHabitLog(habitId, date, completed);
    await fetchLogs();
  };

  const toggleLog = async (logId: number, completed: boolean) => {
    await updateHabitLog(logId, completed);
    await fetchLogs();
  };

  useEffect(() => {
    fetchLogs();
  }, [habitId]);

  return { logs, loading, fetchLogs, addLog, toggleLog };
};
