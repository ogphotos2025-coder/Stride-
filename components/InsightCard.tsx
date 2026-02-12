import { useState, useEffect } from 'react'
import { ThumbsUp, Loader2 } from 'lucide-react'

export default function InsightCard() {
  const [insight, setInsight] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const response = await fetch('/api/ai/insights')
        if (!response.ok) throw new Error('Failed to fetch insights')
        const data = await response.json()
        setInsight(data)
      } catch (err) {
        setError('Ready to analyze your next entry.')
      } finally {
        setLoading(false)
      }
    }

    fetchInsight()
  }, [])

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl bg-white p-6 shadow-md">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (error || !insight) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800">Soul's Insight</h3>
        <p className="mt-4 text-sm text-gray-500">Save an entry to unlock personalized AI coaching based on your history.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800">Soul's Insight</h3>
      <div className="mt-4 space-y-4">
        <p className="text-sm leading-relaxed text-gray-700">{insight.insight_text}</p>
        <div className="rounded-lg bg-primary-50 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary-700">Tomorrow's Micro-Goal</h4>
          <p className="mt-1 text-sm font-medium text-primary-900">
            {insight.tomorrow_micro_goal}
          </p>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button className="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
          <ThumbsUp size={14} />
          <span>Helpful</span>
        </button>
      </div>
    </div>
  )
}
