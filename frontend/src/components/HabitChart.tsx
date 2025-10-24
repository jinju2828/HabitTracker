import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

interface HabitLog {
  id: number
  habit_id: number
  log_date: string
  completed: boolean
}

interface Habit {
  id: number
  name: string
}

// 선택한 습관의 진행 로그 시각화 (Recharts)
export default function HabiCthart() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [selectedHabit, setSelectedHabit] = useState<number | null>(null)
  const [logs, setLogs] = useState<HabitLog[]>([])

  // 전체 습관 불러오기
  useEffect(() => {
    axios.get('http://localhost:3000/habits')
      .then(res => setHabits(res.data))
  }, [])

  // 특정 습관의 로그 불러오기
  useEffect(() => {
    if (selectedHabit) {
      axios.get(`http://localhost:3000/habit-logs/${selectedHabit}`)
        .then(res => {
          const formatted = res.data.map((log: HabitLog) => ({
            date: log.log_date.slice(0, 10),
            completed: log.completed ? 1 : 0,
          }))
          setLogs(formatted)
        })
    }
  }, [selectedHabit])

  return (
    <div style={{ width: '90%', margin: '0 auto', textAlign: 'center' }}>
      <h2>📈 Habit Progress Tracker</h2>

      <select
        onChange={(e) => setSelectedHabit(Number(e.target.value))}
        value={selectedHabit ?? ''}
      >
        <option value="">-- Select a habit --</option>
        {habits.map(habit => (
          <option key={habit.id} value={habit.id}>{habit.name}</option>
        ))}
      </select>

      <div style={{ width: '100%', height: 400, marginTop: 20 }}>
        <ResponsiveContainer>
          <LineChart data={logs}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 1]} tickFormatter={(v) => (v === 1 ? '✔' : '✖')} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="completed" stroke="#82ca9d" name="Completed" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
