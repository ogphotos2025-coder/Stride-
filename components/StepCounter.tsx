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
    <div className="rounded-xl bg-white p-6 shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Daily Steps</h3>
        {isSynced && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Activity size={16} className="text-green-500" />
            <span>Synced</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-baseline gap-4">
        <p className="text-4xl font-bold text-primary-600">{dailySteps.toLocaleString()}</p>
      </div>
      {!isSynced ? (
        <div className="mt-2">
          <label htmlFor="manualSteps" className="sr-only">
            Enter steps manually
          </label>
          <input
            id="manualSteps"
            type="number"
            value={dailySteps === 0 ? '' : dailySteps}
            onChange={(e) => setDailySteps(parseInt(e.target.value || '0', 10))}
            placeholder="Enter steps manually"
            className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-700 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      ) : (
        <p className="mt-1 text-sm text-gray-500">from Google Fit</p>
      )}
    </div>
  )
}
