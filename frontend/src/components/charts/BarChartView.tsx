import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { parseISO, format } from 'date-fns'
import { CustomTooltip } from '../CustomTooltip'  // 추가

interface Props {
  chartData: { date: string; completed: number }[]
}

export const BarChartView: React.FC<Props> = ({ chartData }) => {
  const data = useMemo(() => {
    if (!chartData || chartData.length === 0) return []

    return chartData.map((item) => ({
      date: format(parseISO(item.date), 'MM/dd'),
      completed: item.completed,
    }))
  }, [chartData])

  if (data.length === 0) return <p>No data available.</p>

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} /> {/* ← 변경 */}
        <Bar dataKey="completed" fill="#4f46e5" />
      </BarChart>
    </ResponsiveContainer>
  )
}
