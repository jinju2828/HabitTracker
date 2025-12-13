import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { HabitChartType } from './HabitChartType'
import type { Habit, HabitLog } from '../utils/types'

export const HabitProgressChart: React.FC<{ refreshKey: any }> = ({ refreshKey }) => {
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<Record<number, HabitLog[]>>({})

  useEffect(() => {
    axios
      .get<Habit[]>('http://localhost:3000/habits')
      .then(res => setHabits(res.data))
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!habits.length) return

    const fetchAllLogs = async () => {
      const next: Record<number, HabitLog[]> = {}

      await Promise.all(
        habits.map(async habit => {
          const res = await axios.get<HabitLog[]>(
            `http://localhost:3000/habit-logs/${habit.id}`
          )

          next[habit.id] = res.data
            .map(l => ({ ...l, log_date: l.log_date.slice(0, 10) }))
            .sort((a, b) => a.log_date.localeCompare(b.log_date))
        })
      )

      setLogs(next)
    }

    fetchAllLogs()
  }, [habits, refreshKey])

  return (
    <div style={styles.grid}>
      {habits.map(habit => (
        <div key={habit.id} style={styles.card}>
          <h3 style={styles.title}>{habit.name}</h3>

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
  )
}

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: 24,
    width: '100%',
  },
  card: {
    // background: '#f5b387ff',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  title: {
    marginBottom: 12,
    fontSize: 16,
    fontWeight: 600,
    color: '#333',
  },
}
