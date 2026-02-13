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

        // Fetch Moods from Supabase via API
        const entryRes = await fetch(`/api/daily-entry?start=${currentWeekStart.toISOString()}&end=${weekEnd.toISOString()}`)
        const entries = await entryRes.json()

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
    <div className="marathon-card">
      <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <h3 className="text-3xl">Pace & Soul</h3>
        <div className="flex items-center bg-gray-50 px-6 py-2 rounded-full border border-gray-200">
          <button
            onClick={goToPreviousWeek}
            className="p-2 transition-colors hover:text-[var(--accent-orange)]"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="text-sm font-black uppercase tracking-widest px-4">
            {formattedWeekRange}
          </span>
          <button
            onClick={goToNextWeek}
            className="p-2 transition-colors hover:text-[var(--accent-orange)]"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis
              dataKey="date"
              tickFormatter={(dateStr) => {
                // Ensure we parse the date string (YYYY-MM-DD) as local time, not UTC
                const [year, month, day] = dateStr.split('-').map(Number);
                const date = new Date(year, month - 1, day);
                return format(date, 'EEE');
              }}
              stroke="var(--text-muted)"
              fontSize={14}
              fontWeight="bold"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              dataKey="steps"
              stroke="var(--text-muted)"
              fontSize={12}
              fontWeight="bold"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              dataKey="mood"
              domain={[1, 5]}
              tickCount={5}
              stroke="var(--accent-orange)"
              fontSize={14}
              fontWeight="black"
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '16px' }}
              itemStyle={{ fontWeight: 'bold' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold' }} />
            <Bar
              yAxisId="left"
              dataKey="steps"
              name="Steps"
              fill="var(--primary-navy)"
              radius={[6, 6, 0, 0]}
              barSize={40}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="mood"
              name="Mood"
              stroke="#0ea5e9"
              strokeWidth={4}
              dot={{ r: 6, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 10 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
