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
  log_date: string; // ISO string from backend
  completed: boolean;
}

export const HabitProgressChart: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<Record<number, HabitLog[]>>({}); // habitId -> logs

  // 1) 전체 습관 가져오기
  useEffect(() => {
    axios.get('http://localhost:3000/habits')
      .then(res => setHabits(res.data))
      .catch(err => console.error(err));
  }, []);

  // 2) 각 습관 로그 가져오기 (정규화: YYYY-MM-DD, 정렬, 중복 제거)
  useEffect(() => {
    // fetch all habit logs concurrently
    const fetchAll = async () => {
      try {
        const results = await Promise.all(
          habits.map(habit => axios.get<HabitLog[]>(`http://localhost:3000/habit-logs/${habit.id}`))
        );

        const next: Record<number, HabitLog[]> = {};
        results.forEach((r, idx) => {
          const habitId = habits[idx].id;
          // normalize date -> YYYY-MM-DD, remove duplicates (by date), sort ascending
          const normalized = r.data
            .map(l => ({ ...l, log_date: l.log_date.slice(0, 10) })) // normalize to YYYY-MM-DD
            .sort((a, b) => a.log_date.localeCompare(b.log_date))
            // If same date appears multiple times, keep the latest entry (by id)
            .reduce<HabitLog[]>((acc, cur) => {
              const last = acc.find(x => x.log_date === cur.log_date);
              if (!last) acc.push(cur);
              else if (cur.id > last.id) { // assume higher id is later
                acc = acc.map(x => x.log_date === cur.log_date ? cur : x);
              }
              return acc;
            }, []);

          next[habitId] = normalized;
        });

        setLogs(next);
      } catch (err) {
        console.error('fetchAll habit logs error', err);
      }
    };

    if (habits.length) fetchAll();
  }, [habits]);

  // 3) 차트용 데이터 변환: (날짜별 completed 0/1), only dates that actually have logs
  const getChartData = (habitId: number) => {
    const habitLogs = logs[habitId] ?? [];
    // already normalized & sorted above; map to chart points
    return habitLogs.map(l => ({
      date: l.log_date,
      completed: l.completed ? 1 : 0,
    }));
  };

  return (
    <div>
      {habits.map(habit => {
        const data = getChartData(habit.id);
        return (
          <div key={habit.id} style={{ marginBottom: '50px' }}>
            <h3>{habit.name}</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  {/* type='category' + allowDuplicatedCategory=false: x축에 실제 데이터 날짜만 표시 */}
                  <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
                  <YAxis domain={[0, 1]} 
                          ticks={[0, 1]} // 👈 이거 추가!
                          tickFormatter={(val) => (val === 1 ? '✅' : '❌')} 
                        />
                  <Tooltip formatter={(val: number) => (val === 1 ? 'Completed' : 'Not done')} />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
};
