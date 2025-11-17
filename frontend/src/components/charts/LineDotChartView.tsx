import React, { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Dot } from 'recharts'
import { parseISO, format } from 'date-fns'

interface Props {
  chartData: { date: string; completed: number }[]
}

export const LineDotChartView: React.FC<Props> = ({ chartData }) => {
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
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="completed"
          stroke="#4f46e5"
          strokeWidth={2}
          dot={<Dot r={4} stroke="#4f46e5" strokeWidth={2} fill="#fff" />}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
