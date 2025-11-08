import React, { useState, useMemo } from 'react'
import { LineDotChartView } from './charts/LineDotChartView'
import { BarChartView } from './charts/BarChartView'
import { Heatmap } from './charts/Heatmap'
import type { HabitLog } from '../utils/types'
import { parseISO, format } from 'date-fns'

interface HabitChartTypeProps {
  habitLogs: { date: string; completed: number }[]
}

export const HabitChartType: React.FC<HabitChartTypeProps> = ({ habitLogs }) => {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'heatmap'>('heatmap')
  const [selectedMonth, setSelectedMonth] = useState<string>('')

  if (!habitLogs || habitLogs.length === 0) {
    return <p>No logs available.</p>
  }

  // ✅ 1. 모든 month 목록 추출 (중복 제거)
  const months = useMemo(() => {
    const unique = new Set(
      habitLogs.map((log) => format(parseISO(log.date), 'yyyy-MM'))
    )
    return Array.from(unique).sort()
  }, [habitLogs])

  // ✅ 2. 월별 필터링된 데이터
  const filteredLogs = useMemo(() => {
    if (!selectedMonth) return habitLogs
    return habitLogs.filter(
      (log) => format(parseISO(log.date), 'yyyy-MM') === selectedMonth
    )
  }, [habitLogs, selectedMonth])

  return (
    <div style={{ width: '100%', height: 450 }}>
      {/* ✅ 월별 & 차트 타입 선택 드롭다운 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <label>
          Month:{' '}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ padding: '4px 8px', borderRadius: 4 }}
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
            onChange={(e) => setChartType(e.target.value as 'line' | 'bar' | 'heatmap')}
            style={{ padding: '4px 8px', borderRadius: 4 }}
          >
            <option value="line">Line & Dot</option>
            <option value="bar">Bar</option>
            <option value="heatmap">Heatmap</option>
          </select>
        </label>
      </div>

      {/* ✅ 차트 영역 */}
      <div style={{ height: '100%', minHeight: 350 }}>
        {chartType === 'line' && <LineDotChartView chartData={filteredLogs} />}
        {chartType === 'bar' && <BarChartView chartData={filteredLogs} />}
        {chartType === 'heatmap' && <Heatmap chartData={filteredLogs} />}
      </div>
    </div>
  )
}
