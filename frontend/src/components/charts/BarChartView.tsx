import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { parseISO, format } from 'date-fns'

interface Props {
  chartData: { date: string; completed: number }[]
}

export const BarChartView: React.FC<Props> = ({ chartData }) => {
  const data = useMemo(() => {
    return chartData.map(item => ({
      date: format(parseISO(item.date), "MM/dd"),
      completed: item.completed === -1 ? 0 : item.completed,
      originalCompleted: item.completed,
    }))
  }, [chartData])

  if (data.length === 0) return <p>No data available.</p>

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="date" />
        
        <Bar
          dataKey="completed"
          shape={(props: any) => {
            const { x, y, width, height, payload } = props
            const isNotYet = payload.originalCompleted === -1
            const color = isNotYet ? "#ddd" : "#4f46e5"
            return <rect x={x} y={y} width={width} height={height} fill={color} />
          }}
        />

        <Tooltip
          labelFormatter={(label) => `Date: ${label}`}
          contentStyle={{ color: '#000' }}         // Tooltip 내부 텍스트 색상   
          formatter={(_, __, payload: any) => {
            const v = payload?.payload?.originalCompleted
            return v === -1 ? "Not yet" : v === 1 ? "Completed" : "Not done"
          }}
        />

        <YAxis 
          domain={[0, 1]} 
          ticks={[0, 1]} 
          tickFormatter={(v) => (v === 1 ? "Done" : "Miss")}/>
      </BarChart>
    </ResponsiveContainer>
  )
}
