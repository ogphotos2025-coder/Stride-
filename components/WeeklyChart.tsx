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
        weekEnd.setHours(23, 59, 59, 999) // Ensure full end day

        console.log('Fetching WeeklyChart data for range:', {
          start: currentWeekStart.toISOString(),
          end: weekEnd.toISOString()
        })

        // Fetch Steps from Google Fit
        const fitRes = await fetch(`/api/googlefit?startTime=${currentWeekStart.getTime()}&endTime=${weekEnd.getTime()}`)
        const fitData = await fitRes.json()

        // Map Google Fit buckets to dates
        const fitMap = new Map<string, number>()
        if (fitData && fitData.bucket) {
          fitData.bucket.forEach((bucket: any, index: number) => {
            // Google Fit buckets might not align perfectly with our days, 
            // but since we bucket by 24h starting at startTime, index 0 is Day 1
            const date = addDays(currentWeekStart, index)
            const formattedDate = format(date, 'yyyy-MM-dd')
            let steps = 0
            if (bucket.dataset) {
              bucket.dataset.forEach((ds: any) => {
                ds.point.forEach((point: any) => {
                  point.value.forEach((val: any) => {
                    if (val.intVal) steps += val.intVal
                  })
                })
              })
            }
            fitMap.set(formattedDate, steps)
          })
        }

        // Fetch Moods from Supabase
        const entries = await getDailyEntries(
          session.user.id as string,
          currentWeekStart,
          weekEnd
        )

        console.log('Fetched mood entries:', entries?.length)

        const moodMap = new Map<string, number[]>()
        entries.forEach((entry: DailyEntry) => {
          console.log('Processing entry for mapping:', { date: entry.date, mood: entry.mood })
          if (!moodMap.has(entry.date)) {
            moodMap.set(entry.date, [])
          }
          moodMap.get(entry.date)!.push(moodToScore[entry.mood] || 0)
        })

        const newChartData = Array.from({ length: 7 }).map((_, i) => {
          const date = addDays(currentWeekStart, i)
          const formattedDate = format(date, 'yyyy-MM-dd')
          const dayMoods = moodMap.get(formattedDate)

          return {
            date: formattedDate,
            // Use live Google Fit steps
            steps: fitMap.get(formattedDate) || 0,
            // Use average mood from database
            mood: dayMoods && dayMoods.length > 0
              ? dayMoods.reduce((a, b) => a + b, 0) / dayMoods.length
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
