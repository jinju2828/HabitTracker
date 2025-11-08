import React, { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { HeatmapChartView } from './charts/HeatmapChartView'
import { LineDotChartView } from './charts/LineDotChartView'
import { BarChartView } from './charts/BarChartView'


export interface HabitChartTypeProps {
  habitLogs?: { date: string; completed: number }[]
  chartType?: 'heatmap' | 'line' | 'bar'
}

export const HabitChartType: React.FC<HabitChartTypeProps> = ({
  habitLogs = [],
  chartType = 'heatmap',
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'))

  const filteredLogs = habitLogs.filter((log) => {
    try {
      return format(parseISO(log.date), 'yyyy-MM') === selectedMonth
    } catch {
      return false
    }
  })

  const uniqueMonths: string[] = Array.from(
    new Set(
      habitLogs
        .map((l) => {
          try {
            return format(parseISO(l.date), 'yyyy-MM')
          } catch {
            return null
          }
        })
        .filter((v): v is string => !!v)
    )
  ).sort()

  return (
    <div>
      <label>
        Month:
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          {uniqueMonths.map((month) => (
            <option key={month} value={month}>
              {format(parseISO(`${month}-01`), 'yyyy년 M월')}
            </option>
          ))}
        </select>
      </label>

      {chartType === 'heatmap' && <HeatmapChartView chartData={filteredLogs} />}
      {chartType === 'line' && <LineDotChartView chartData={filteredLogs} />}
      {chartType === 'bar' && <BarChartView chartData={filteredLogs} />}
    </div>
  )
}
