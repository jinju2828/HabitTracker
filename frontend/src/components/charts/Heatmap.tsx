import React from 'react'
import { ResponsiveHeatMap } from '@nivo/heatmap'
import { eachDayOfInterval, format, parseISO, startOfWeek, addDays } from 'date-fns'

export interface HeatmapProps {
  chartData: { date: string; completed: number }[]
}

/**
 * 주 단위 + 월요일 시작
 */
const groupByWeek = (chartData: { date: string; completed: number }[]) => {
  if (!chartData.length) return []

  // 전체 기간: chartData의 최소/최대 날짜
  const sortedDates = chartData.map(d => parseISO(d.date)).sort((a, b) => a.getTime() - b.getTime())
  const start = startOfWeek(sortedDates[0], { weekStartsOn: 1 }) // 월요일 기준
  const end = sortedDates[sortedDates.length - 1]

  // 월요일 기준 모든 날짜 배열
  const allDates = eachDayOfInterval({ start, end })

  // 날짜별 completed map
  const logMap = new Map(chartData.map(d => [d.date, d.completed]))

  // 주 단위 그룹핑
  const weeks: Record<string, { x: string; y: number; fullDate: string }[]> = {}

  allDates.forEach(date => {
    const weekKey = format(date, "'W'w yyyy") // ex: W41 2025
    const dayName = format(date, 'EEE')      // Mon, Tue 등
    const iso = format(date, 'yyyy-MM-dd')
    const completed = logMap.get(iso) ?? 0

    if (!weeks[weekKey]) weeks[weekKey] = []
    weeks[weekKey].push({ x: dayName, y: completed, fullDate: iso })
  })

  return Object.entries(weeks).map(([id, data]) => ({ id, data }))
}

export const Heatmap: React.FC<HeatmapProps> = ({ chartData }) => {
  const heatmapRows = groupByWeek(chartData)

  return (
    <div style={{ height: 300 }}>
      <ResponsiveHeatMap
        data={heatmapRows}
        margin={{ top: 30, right: 40, bottom: 40, left: 40 }}
        valueFormat=".0f"
        axisTop={null}
        axisRight={null}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          legend: 'Day',
          legendPosition: 'middle',
          legendOffset: -30,
        }}
        colors={{ type: 'diverging', scheme: 'greens', minValue: 0, maxValue: 1 }}
        emptyColor="#eeeeee"
        borderWidth={1}
        borderColor="#ffffff"
        tooltip={({ cell }) => {
          const { y, fullDate } = cell.data as { y: number; fullDate: string }
          return (
            <div
              style={{
                background: 'white',
                padding: '6px 8px',
                borderRadius: 4,
                boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
              }}
            >
              <div><strong>{fullDate}</strong></div>
              <div>{y === 1 ? '✅ Completed' : '❌ Missed'}</div>
            </div>
          )
        }}
      />
    </div>
  )
}
