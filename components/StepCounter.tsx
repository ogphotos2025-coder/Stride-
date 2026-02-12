'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Activity } from 'lucide-react'

interface StepCounterProps {
  dailySteps: number
  setDailySteps: (steps: number) => void
}

export default function StepCounter({ dailySteps, setDailySteps }: StepCounterProps) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      setLoading(true)
      fetch('/api/googlefit')
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch step data')
          }
          return res.json()
        })
        .then((data) => {
          console.log('Raw Google Fit Data:', data)

          // The last bucket is "Today"
          const lastBucket = data.bucket[data.bucket.length - 1]
          let totalTodaySteps = 0

          if (lastBucket && lastBucket.dataset) {
            lastBucket.dataset.forEach((ds: any) => {
              ds.point.forEach((point: any) => {
                point.value.forEach((val: any) => {
                  if (val.intVal) totalTodaySteps += val.intVal
                })
              })
            })
          }

          console.log('Calculated Today Steps:', totalTodaySteps)
          setDailySteps(totalTodaySteps)
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message)
          setLoading(false)
        })
    } else {
      setDailySteps(0) // Reset if not signed in
      setLoading(false)
    }
  }, [session, setDailySteps])

  const isSynced = !!session

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl bg-white p-6 shadow-md">
        <p>Loading step data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl bg-white p-6 shadow-md">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="marathon-card overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-xl">
            <Activity className="text-[var(--accent-orange)]" size={32} />
          </div>
          <h3 className="text-3xl">Total Stride</h3>
        </div>
        {isSynced && (
          <div className="bg-green-100 text-green-700 font-bold px-4 py-1 rounded-full text-xs uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Live Performance
          </div>
        )}
      </div>

      <div className="flex flex-col items-start">
        <p className="stat-hero leading-none">
          {dailySteps.toLocaleString()}
        </p>
        <p className="data-label mt-2">Steps Synchronized</p>
      </div>

      {!isSynced ? (
        <div className="mt-8">
          <label htmlFor="manualSteps" className="data-label mb-2 block">
            Manual Calibration
          </label>
          <input
            id="manualSteps"
            type="number"
            value={dailySteps === 0 ? '' : dailySteps}
            onChange={(e) => setDailySteps(parseInt(e.target.value || '0', 10))}
            placeholder="00,000"
            className="w-full bg-gray-50 rounded-xl border border-gray-200 p-4 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
          />
        </div>
      ) : (
        <div className="mt-8 flex items-center gap-2 text-gray-400 font-bold uppercase text-xs tracking-widest">
          <span className="w-8 h-[2px] bg-gray-200"></span>
          Integrated with Google Fit
        </div>
      )}
    </div>
  )
}
