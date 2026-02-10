'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react'

export default function StepCounter() {
  const { data: session } = useSession()
  const [steps, setSteps] = useState(0)
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
          const todaySteps = data.bucket[data.bucket.length - 1]?.dataset[0]?.point[0]?.value[0]?.intVal || 0
          setSteps(todaySteps)
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [session])

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
        <p className="text-4xl font-bold text-primary-600">{steps.toLocaleString()}</p>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        {isSynced ? 'from Google Fit' : 'Manually entered'}
      </p>
    </div>
  )
}
