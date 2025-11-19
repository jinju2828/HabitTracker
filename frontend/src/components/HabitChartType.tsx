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
  const [selectedMonth, setSelectedMonth] = useState<string>('')

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

  // 🔥🔥🔥 해당 월의 모든 날짜 생성 + 로그 없는 날은 completed = 0
  const fullChartData = useMemo(() => {
    if (filteredLogs.length === 0) return []

    const monthDate = parseISO(filteredLogs[0].date)
    const start = startOfMonth(monthDate)
    const end = endOfMonth(monthDate)

    const allDates = eachDayOfInterval({ start, end })

    const logMap = new Map(
      filteredLogs.map((l) => [format(parseISO(l.date), "yyyy-MM-dd"), l])
    )

    return allDates.map((d) => {
      const key = format(d, "yyyy-MM-dd")
      const log = logMap.get(key)
      return {
        date: key,
        completed: log ? log.completed : 0, // 로그가 없으면 0!
      }
    })
  }, [filteredLogs])

  return (
    <div style={{ width: '100%', height: 450 }}>
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
