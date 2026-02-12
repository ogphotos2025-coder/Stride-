'use client'
import { useState, useEffect } from 'react'
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
import { useSession } from 'next-auth/react'
import { addDays, subDays, startOfWeek, endOfWeek, format } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getDailyEntries } from '@/lib/database'
import { DailyEntry } from '@/types'

// Map mood strings to numerical scores for charting
const moodToScore: { [key: string]: number } = {
  Angry: 1,
  Sad: 2,
  Okay: 3,
  Good: 4,
  Happy: 5,
}

export default function WeeklyChart() {
  const { data: session } = useSession()
  const [chartData, setChartData] = useState<
    { date: string; steps: number; mood: number }[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )

  useEffect(() => {
    const fetchChartData = async () => {
      if (!session?.user?.id) return
      setLoading(true)
      setError(null)

      try {
        const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 })
        const entries = await getDailyEntries(
          session.user.id as string,
          currentWeekStart,
          weekEnd
        )

        // Generate data for all 7 days of the week, even if no entry exists
        const dataMap = new Map<string, { steps: number[]; moods: number[] }>()
        entries.forEach((entry: DailyEntry) => {
          if (!dataMap.has(entry.date)) {
            dataMap.set(entry.date, { steps: [], moods: [] })
          }
          const dayData = dataMap.get(entry.date)!
          dayData.steps.push(entry.step_count)
          dayData.moods.push(moodToScore[entry.mood] || 0)
        })

        const newChartData = Array.from({ length: 7 }).map((_, i) => {
          const date = addDays(currentWeekStart, i)
          const formattedDate = format(date, 'yyyy-MM-dd')
          const dayData = dataMap.get(formattedDate)

          return {
            date: formattedDate,
            // Use the maximum step count recorded for that day (since steps are cumulative)
            steps: dayData && dayData.steps.length > 0 ? Math.max(...dayData.steps) : 0,
            // Use the average mood score for the day
            mood: dayData && dayData.moods.length > 0
              ? dayData.moods.reduce((a, b) => a + b, 0) / dayData.moods.length
              : 0,
          }
        })
        setChartData(newChartData)
      } catch (err) {
        console.error('Failed to fetch chart data:', err)
        setError('Failed to load chart data.')
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [session, currentWeekStart])

  const goToPreviousWeek = () => {
    setCurrentWeekStart((prev) => subDays(prev, 7))
  }

  const goToNextWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, 7))
  }

  const formattedWeekRange = `${format(currentWeekStart, 'MMM d')} - ${format(
    endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
    'MMM d, yyyy'
  )}`

  if (!session) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl bg-white p-6 shadow-md">
        <p className="text-gray-500">Sign in to view your weekly progress.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl bg-white p-6 shadow-md">
        <p>Loading chart data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl bg-white p-6 shadow-md">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Your Week at a Glance</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousWeek}
            className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium text-gray-700">
            {formattedWeekRange}
          </span>
          <button
            onClick={goToNextWeek}
            className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
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
