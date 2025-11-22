import React, { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { parseISO, format } from 'date-fns'

interface Props {
  chartData: { date: string; completed: number }[]
}

export const LineDotChartView: React.FC<Props> = ({ chartData }) => {
  const data = useMemo(() => {
    return chartData.map(item => ({
      date: format(parseISO(item.date), "MM/dd"),
      completed: item.completed === -1 ? 0 : item.completed,
      originalCompleted: item.completed, // -1 보관
    }))
  }, [chartData])

  if (data.length === 0) return <p>No data available.</p>

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis
          domain={[0, 1]}
          ticks={[0, 1]}
          tickFormatter={(v) => (v === 1 ? "Done" : "Miss")}
        />

        <Tooltip
          labelFormatter={(label) => `Date: ${label}`}
          contentStyle={{ color: '#000' }}         // Tooltip 내부 텍스트 색상
          formatter={(_, __, payload: any) => {
            const v = payload?.payload?.originalCompleted
            return v === -1 ? "Not yet" : v === 1 ? "Completed" : "Not done"
          }}
        />

        <Line
          dataKey="completed"
          stroke="#4f46e5"
          dot={({ cx, cy, payload }) => {
            const isNotYet = payload.originalCompleted === -1

            return (
              <circle
                cx={cx}
                cy={cy}
                r={4}
                fill={isNotYet ? "#ccc" : "#fff"}
                stroke={isNotYet ? "#999" : "#4f46e5"}
              />
            )
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
