import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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

export const BarChartView: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<Record<number, HabitLog[]>>({});

  // 1️⃣ 전체 습관 가져오기
  useEffect(() => {
    axios.get('http://localhost:3000/habits')
      .then((res) => setHabits(res.data))
      .catch((err) => console.error(err));
  }, []);

  // 2️⃣ 각 습관 로그 가져오기
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const results = await Promise.all(
          habits.map((habit) => axios.get<HabitLog[]>(`http://localhost:3000/habit-logs/${habit.id}`))
        );

        const next: Record<number, HabitLog[]> = {};
        results.forEach((r, idx) => {
          const habitId = habits[idx].id;
          const normalized = r.data.map((l) => ({
            ...l,
            log_date: l.log_date.slice(0, 10),
          }));
          next[habitId] = normalized;
        });

        setLogs(next);
      } catch (err) {
        console.error(err);
      }
    };

    if (habits.length) fetchAll();
  }, [habits]);

  // 3️⃣ 차트 데이터 변환
  const getChartData = (habitId: number) =>
    (logs[habitId] ?? []).map((l) => ({
      date: l.log_date,
      completed: l.completed ? 1 : 0,
    }));

  return (
    <div style={{ color: '#444' }}>
      <h3>📦 Bar Chart View</h3>
      <p style={{ color: '#888', marginBottom: '20px' }}>
        Compare daily completion visually by bar height.
      </p>

      {habits.map((habit) => (
        <div key={habit.id} style={{ marginBottom: '50px' }}>
          <h3>{habit.name}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getChartData(habit.id)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                domain={[0, 1]}
                ticks={[0, 1]}
                tickFormatter={(val) => (val === 1 ? '✅' : '❌')}
              />
              <Tooltip formatter={(v: number) => (v === 1 ? 'Completed' : 'Not done')} />
              <Legend />
              <Bar dataKey="completed" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};
