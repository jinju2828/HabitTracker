import React, { useMemo } from 'react'
import { ResponsiveHeatMap } from '@nivo/heatmap'
import { eachDayOfInterval, format, parseISO, startOfWeek } from 'date-fns'
import type { HabitLog } from '../../utils/types'

interface TotalHeatmapProps {
  allLogs: HabitLog[] // ✅ 모든 습관 로그 (habit 구분 없이)
}

const groupByWeek = (chartData: { date: string; completed: number }[]) => {
  if (!chartData.length) return []

  const sortedDates = chartData
    .map(d => parseISO(d.date))
    .sort((a, b) => a.getTime() - b.getTime())

  const start = startOfWeek(sortedDates[0], { weekStartsOn: 0 })
  const end = sortedDates[sortedDates.length - 1]

  const allDates = eachDayOfInterval({ start, end })

  const logMap = new Map(chartData.map(d => [d.date, d.completed]))
  const weeks: Record<string, { x: string; y: number; fullDate: string }[]> = {}

  allDates.forEach(date => {
    const weekNumber = format(date, "'W'w")
    const dayName = format(date, 'EEE')
    const iso = format(date, 'yyyy-MM-dd')
    const completed = logMap.get(iso) ?? 0

    if (!weeks[weekNumber]) weeks[weekNumber] = []
    weeks[weekNumber].push({ x: dayName, y: completed, fullDate: iso })
  })

  return Object.entries(weeks).map(([id, data]) => ({ id, data }))
}

export const TotalHeatmap: React.FC<TotalHeatmapProps> = ({ allLogs }) => {
  // ✅ 날짜별 완료 습관 수 합산
  const dateCounts = useMemo(() => {
    const countMap: Record<string, number> = {}

    allLogs.forEach((log) => {
        console.log('HabitLog:', log);
      const date = log.log_date.slice(0, 10)
      if (!countMap[date]) countMap[date] = 0
      if (log.completed) countMap[date] += 1
    })

    return Object.entries(countMap).map(([date, completed]) => ({ date, completed }))
  }, [allLogs])

  const heatmapRows = groupByWeek(dateCounts)

  // ✅ 색상 단계
  const getColor = (value: number) => {
    if (value === 0) return '#eeeeee'
    if (value <= 2) return '#c6e48b'
    if (value <= 4) return '#7bc96f'
    if (value <= 6) return '#239a3b'
    return '#196127'
  }

  return (
    <div style={{ height: 300 }}>
      <ResponsiveHeatMap
        data={heatmapRows}
        margin={{ top: 50, right: 40, bottom: 40, left: 60 }}
        labelTextColor="transparent"
        valueFormat={() => ''}
        colors={({ value }) => getColor(value || 0)}
        emptyColor="#eeeeee"
        axisTop={{
          tickRotation: 0,
          legend: 'Day of Week',
          legendPosition: 'middle',
          legendOffset: -30,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          legend: 'Week #',
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        borderWidth={1}
        borderColor="#fff"
        tooltip={({ cell }) => {
          const { y, fullDate } = cell.data as { y: number; fullDate: string }
          return (
            <div
              style={{
                background: 'white',
                padding: '6px 8px',
                borderRadius: 4,
                boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
                color: '#333',
              }}
            >
              <div><strong>{fullDate}</strong></div>
              <div>{y} habit(s) completed</div>
            </div>
          )
        }}
      />
    </div>
  )
}
