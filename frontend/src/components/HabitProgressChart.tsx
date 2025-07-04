import React, { useEffect, useState } from 'react';
import { getHabits, getHabitLogs } from '../api/habits';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

interface ProgressData {
  name: string;      // habit 이름
  completed: number; // 이번 주 완료 횟수
  total: number;     // 이번 주 총 일수
}

const HabitProgressChart: React.FC = () => {
  const [data, setData] = useState<ProgressData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const habits = await getHabits();

      const chartData: ProgressData[] = await Promise.all(
        habits.map(async habit => {
          const logs = await getHabitLogs(habit.id);

          // 최근 7일 필터
          const last7Days = new Date();
          last7Days.setDate(last7Days.getDate() - 6); // 오늘 포함 7일

          const weekLogs = logs.filter(log => new Date(log.log_date) >= last7Days);
          const completed = weekLogs.filter(log => log.completed).length;

          return {
            name: habit.name,
            completed,
            total: 7,
          };
        })
      );

      setData(chartData);
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value: number) => [`${value}`, '완료']} />
        <Legend />
        <Bar dataKey="completed" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HabitProgressChart;
