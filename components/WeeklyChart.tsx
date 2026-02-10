'use client'
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  ComposedChart,
} from 'recharts'
import { format } from 'date-fns'

const data = [
  { date: '2024-07-01', steps: 8500, mood: 4 },
  { date: '2024-07-02', steps: 9200, mood: 5 },
  { date: '2024-07-03', steps: 4300, mood: 2 },
  { date: '2024-07-04', steps: 12000, mood: 5 },
  { date: '2024-07-05', steps: 6000, mood: 3 },
  { date: '2024-07-06', steps: 14000, mood: 5 },
  { date: '2024-07-07', steps: 7200, mood: 4 },
]

export default function WeeklyChart() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800">Your Week at a Glance</h3>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), 'EEE')}
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis
              yAxisId="left"
              dataKey="steps"
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              dataKey="mood"
              domain={[1, 5]}
              tickCount={5}
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="steps"
              name="Steps"
              fill="#0ea5e9"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="mood"
              name="Mood"
              stroke="#f59e0b"
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
