import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { HabitChartType } from './HabitChartType'
import type { Habit, HabitLog } from '../utils/types'

export const HabitProgressChart: React.FC<{ refreshKey: any }> = ({ refreshKey }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<Record<number, HabitLog[]>>({});

  useEffect(() => {
    axios.get<Habit[]>('http://localhost:3000/habits')
      .then(res => setHabits(res.data))
      .catch(err => console.error(err));
  }, []);

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
  }, [habits, refreshKey]);

  return (
    <div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
    gap: 24,
  }}
>
      {habits.map((habit) => (
        <div
          key={habit.id}
          style={{
            padding: 16,
            borderRadius: 12,
            background: '#fafafa',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            color: '#333',
          }}
        >
          <h3 style={{ marginBottom: 8, marginTop: 0 }}>{habit.name}</h3>

          <HabitChartType
            habitLogs={
              logs[habit.id]?.map(l => ({
                date: l.log_date,
                completed: l.completed ? 1 : 0,
              })) ?? []
            }
          />
        </div>
      ))}
    </div>
  );
};
