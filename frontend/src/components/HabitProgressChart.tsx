import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
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

export const HabitProgressChart: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<Record<string, HabitLog[]>>({}); // habitId → logs

  // 1️⃣ 습관 목록 가져오기
  useEffect(() => {
    axios.get('http://localhost:3000/habits')
      .then(res => setHabits(res.data))
      .catch(err => console.error(err));
  }, []);

  // 2️⃣ 각 습관 로그 가져오기
  useEffect(() => {
    habits.forEach(habit => {
      axios.get(`http://localhost:3000/habit-logs/${habit.id}`)
        .then(res => {
          setLogs(prev => ({ ...prev, [habit.id]: res.data }));
        })
        .catch(err => console.error(err));
    });
  }, [habits]);

  // 3️⃣ 차트 데이터 변환 (날짜별 % 완료)
  const getChartData = (habitId: number) => {
    const habitLogs = logs[habitId] || [];
    return habitLogs.map(log => ({
      date: log.log_date,
      completed: log.completed ? 1 : 0,
    }));
  };

  return (
    <div>
      {habits.map(habit => (
        <div key={habit.id} style={{ marginBottom: '50px' }}>
          <h3>{habit.name}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getChartData(habit.id)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 1]} tickFormatter={(val) => (val === 1 ? '✅' : '❌')} />
              <Tooltip formatter={(val: number) => (val === 1 ? 'Completed' : 'Not done')} />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};
