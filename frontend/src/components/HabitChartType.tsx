import React, { useState, useMemo } from 'react'
import { LineDotChartView } from './charts/LineDotChartView'
import { BarChartView } from './charts/BarChartView'
import { Heatmap } from './charts/Heatmap'
import { parseISO, format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'

interface HabitChartTypeProps {
  habitLogs: { date: string; completed: number }[]
}

export const HabitChartType: React.FC<HabitChartTypeProps> = ({ habitLogs }) => {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'heatmap'>('heatmap')
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), 'yyyy-MM') // 현재 월을 기본값으로
  )

  // 월 목록
  const months = useMemo(() => {
    const unique = new Set(
      habitLogs.map((log) => format(parseISO(log.date), 'yyyy-MM'))
    )
    return Array.from(unique).sort()
  }, [habitLogs])

  // 드롭다운으로 필터링된 logs
  const filteredLogs = useMemo(() => {
    if (!selectedMonth) return habitLogs
    return habitLogs.filter(
      (log) => format(parseISO(log.date), 'yyyy-MM') === selectedMonth
    )
  }, [habitLogs, selectedMonth])

  const fullChartData = useMemo(() => {
  if (filteredLogs.length === 0) return []

  let start: Date, end: Date

  if (selectedMonth) {
    const monthDate = parseISO(filteredLogs[0].date)
    start = startOfMonth(monthDate)
    end = endOfMonth(monthDate)
  } else {
    const dates = filteredLogs.map(l => parseISO(l.date))
    start = new Date(Math.min(...dates.map(d => d.getTime())))
    end = new Date(Math.max(...dates.map(d => d.getTime())))
  }

  const allDates = eachDayOfInterval({ start, end })
  const logMap = new Map(filteredLogs.map(l => [format(parseISO(l.date), "yyyy-MM-dd"), l]))

  return allDates.map(d => {
    const key = format(d, "yyyy-MM-dd")
    const isFuture = d > new Date()
    if (isFuture) return { date: key, completed: -1 }
    const log = logMap.get(key)
    return { date: key, completed: log ? log.completed : 0 }
  })
}, [filteredLogs, selectedMonth])


  return (
    <div style={{ width: '100%', height: 350 }}>
      {/* 월/타입 선택 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <label>
          Month:{' '}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">All</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label>
          Chart Type:{' '}
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as any)}
          >
            <option value="line">Line & Dot</option>
            <option value="bar">Bar</option>
            <option value="heatmap">Heatmap</option>
          </select>
        </label>
      </div>

      {/* 차트 */}
      <div style={{ height: '100%', minHeight: 350 }}>
        {chartType === 'line' && <LineDotChartView chartData={fullChartData} />}
        {chartType === 'bar' && <BarChartView chartData={fullChartData} />}
        {chartType === 'heatmap' && <Heatmap chartData={fullChartData} />}
      </div>
    </div>
  )
}
