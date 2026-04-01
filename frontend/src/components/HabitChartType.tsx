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

  // 월 목록 (로그가 없어도 현재 월은 항상 선택 가능)
  const months = useMemo(() => {
    const unique = new Set(
      habitLogs.map((log) => format(parseISO(log.date), 'yyyy-MM'))
    )
    unique.add(format(new Date(), 'yyyy-MM'))
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
    // 특정 월 선택: 그 달에 로그가 없어도 해당 월 전체 날짜(빈 값)로 차트 표시
    if (selectedMonth) {
      const monthDate = parseISO(`${selectedMonth}-01`)
      const start = startOfMonth(monthDate)
      const end = endOfMonth(monthDate)
      const allDates = eachDayOfInterval({ start, end })
      const logMap = new Map(
        filteredLogs.map((l) => [format(parseISO(l.date), 'yyyy-MM-dd'), l])
      )
      return allDates.map((d) => {
        const key = format(d, 'yyyy-MM-dd')
        const isFuture = d > new Date()
        if (isFuture) return { date: key, completed: -1 }
        const log = logMap.get(key)
        return { date: key, completed: log ? log.completed : 0 }
      })
    }

    // All: 로그가 없으면 표시할 범위가 없음
    if (filteredLogs.length === 0) return []

    const dates = filteredLogs.map((l) => parseISO(l.date))
    const start = new Date(Math.min(...dates.map((d) => d.getTime())))
    const end = new Date(Math.max(...dates.map((d) => d.getTime())))
    const allDates = eachDayOfInterval({ start, end })
    const logMap = new Map(
      filteredLogs.map((l) => [format(parseISO(l.date), 'yyyy-MM-dd'), l])
    )

    return allDates.map((d) => {
      const key = format(d, 'yyyy-MM-dd')
      const isFuture = d > new Date()
      if (isFuture) return { date: key, completed: -1 }
      const log = logMap.get(key)
      return { date: key, completed: log ? log.completed : 0 }
    })
  }, [filteredLogs, selectedMonth])


  return (
  <div style={{ width: '100%', height: 260 }}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 8,
        flexWrap: 'wrap',
      }}
    >
      <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
        <option value="">All</option>
        {months.map(m => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <select
        value={chartType}
        onChange={e => setChartType(e.target.value as any)}
      >
        <option value="line">Line</option>
        <option value="bar">Bar</option>
        <option value="heatmap">Heatmap</option>
      </select>
    </div>

    <div style={{ height: 200 }}>
      {chartType === 'line' && <LineDotChartView chartData={fullChartData} />}
      {chartType === 'bar' && <BarChartView chartData={fullChartData} />}
      {chartType === 'heatmap' && <Heatmap chartData={fullChartData} />}
    </div>
  </div>
)

}
