import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

interface Habit {
  id: number;
  name: string;
}

interface HabitLog {
  id: number;
  habit_id: number;
  log_date: string;
  completed: boolean;
}

export const LineDotChartView: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<Record<number, HabitLog[]>>({});

  useEffect(() => {
    axios.get('http://localhost:3000/habits').then((res) => setHabits(res.data));
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.all(
        habits.map((h) => axios.get<HabitLog[]>(`http://localhost:3000/habit-logs/${h.id}`))
      );
      const next: Record<number, HabitLog[]> = {};
      results.forEach((r, idx) => {
        const id = habits[idx].id;
        const normalized = r.data.map((l) => ({
          ...l,
          log_date: l.log_date.slice(0, 10),
        }));
        next[id] = normalized;
      });
      setLogs(next);
    };
    if (habits.length) fetchAll();
  }, [habits]);

  const getChartData = (habitId: number) =>
    (logs[habitId] ?? []).map((l) => ({
      date: l.log_date,
      completed: l.completed ? 1 : 0,
    }));

  return (
    <div>
      {habits.map((habit) => (
        <div key={habit.id} style={{ marginBottom: '40px' }}>
          <h3>{habit.name}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getChartData(habit.id)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                domain={[0, 1]}
                ticks={[0, 1]}
                tickFormatter={(v) => (v === 1 ? '✅' : '❌')}
              />
              <Tooltip formatter={(v: number) => (v === 1 ? 'Completed' : 'Not done')} />
              <Legend />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#8884d8"
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};
