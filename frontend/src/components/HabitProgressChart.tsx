import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ResponsiveContainer } from 'recharts';
import { HabitChartType } from './HabitChartType';
import type { Habit, HabitLog } from '../utils/types'; // 타입만 import

export const HabitProgressChart: React.FC<{ refreshKey: any }> = ({ refreshKey }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<Record<number, HabitLog[]>>({});

  // 1) 전체 습관 가져오기
  useEffect(() => {
    axios.get<Habit[]>('http://localhost:3000/habits')
      .then(res => setHabits(res.data))
      .catch(err => console.error(err));
  }, []);

  // 2) 각 습관 로그 가져오기 (refreshKey 변할 때마다 실행)
  useEffect(() => {
    if (!habits.length) return;

    const fetchAllLogs = async () => {
      const next: Record<number, HabitLog[]> = {};

      await Promise.all(
        habits.map(async (habit) => {
          const res = await axios.get<HabitLog[]>(`http://localhost:3000/habit-logs/${habit.id}`);

          const normalized = res.data
            .map(l => ({ ...l, log_date: l.log_date.slice(0, 10) }))
            .sort((a, b) => a.log_date.localeCompare(b.log_date));

          next[habit.id] = normalized;
        })
      );

      setLogs(next);
    };

    fetchAllLogs();
  }, [habits, refreshKey]); // 🔥 새로 추가된 부분

  return (
    <div>
      {habits.map((habit) => (
        <div key={habit.id} style={{ marginBottom: '50px' }}>
          <h3>{habit.name}</h3>
          <HabitChartType
            habitLogs={logs[habit.id]?.map(l => ({
              date: l.log_date,
              completed: l.completed ? 1 : 0,
            })) ?? []}
          />
        </div>
      ))}
    </div>
  );
};
