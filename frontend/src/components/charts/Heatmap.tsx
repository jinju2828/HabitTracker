import React from 'react'
import { ResponsiveHeatMap } from '@nivo/heatmap'
import { eachDayOfInterval, format, parseISO, startOfWeek } from 'date-fns'

export interface HeatmapProps {
  chartData: { date: string; completed: number }[]
}

/**
 * 주 단위 + 일요일 시작
 */
const groupByWeek = (chartData: { date: string; completed: number }[]) => {
  if (!chartData.length) return []

  // 전체 기간
  const sortedDates = chartData
    .map(d => parseISO(d.date))
    .sort((a, b) => a.getTime() - b.getTime())

  const start = startOfWeek(sortedDates[0], { weekStartsOn: 0 })
  const end = sortedDates[sortedDates.length - 1]

  // 모든 날짜
  const allDates = eachDayOfInterval({ start, end })

  // 날짜별 completed 저장
  const logMap = new Map(chartData.map(d => [d.date, d.completed]))

  // 주 단위로 그룹핑
  const weeks: Record<string, { x: string; y: number; fullDate: string }[]> = {}

  allDates.forEach(date => {
    const weekNumber = format(date, "'W'w")
    const dayName = format(date, 'EEE')
    const iso = format(date, 'yyyy-MM-dd')

    // ❗ 미래 날짜(-1) 그대로 유지하도록 수정
    const completed = logMap.has(iso) ? logMap.get(iso)! : 0

    if (!weeks[weekNumber]) weeks[weekNumber] = []
    weeks[weekNumber].push({ x: dayName, y: completed, fullDate: iso })
  })

  return Object.entries(weeks).map(([id, data]) => ({ id, data }))
}

export const Heatmap: React.FC<HeatmapProps> = ({ chartData }) => {
  const heatmapRows = groupByWeek(chartData)

  return (
    <div style={{ height: 280 }}>
      <ResponsiveHeatMap
        data={heatmapRows}
        margin={{ top: 50, right: 40, bottom: 40, left: 60 }}

        // 숫자 숨김
        labelTextColor="transparent"
        valueFormat={() => ''}

        // 색 처리
        colors={(cell) => {
          if (cell.value === -1) return '#d0d0d0' // ❗ 미래 날짜 = 회색
          return cell.value === 1 ? '#4CAF50' : '#f5f5f5'
        }}
        emptyColor="#f5f5f5"

        // axisTop={{
        //   tickRotation: 0,
        //   legend: 'Day of Week',
        //   legendPosition: 'middle',
        //   legendOffset: -30,
        // }}
        axisRight={null}
        axisBottom={null}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          legend: 'Week',
          legendPosition: 'middle',
          legendOffset: -50,
        }}
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
                color: '#333',
              }}
            >
              <div><strong>{fullDate}</strong></div>

              {y === -1 && <div>⏳ Not yet</div>}
              {y === 1 && <div>✅ Completed</div>}
              {y === 0 && <div>❌ Missed</div>}
            </div>
          )
        }}
      />
    </div>
  )
}
