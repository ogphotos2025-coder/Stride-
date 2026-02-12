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
    <div className="marathon-card bg-white border-l-8 border-l-[var(--accent-orange)]">
      <h3 className="text-3xl mb-6">Performance Coach</h3>
      <div className="space-y-6">
        <p className="text-xl leading-relaxed italic text-[var(--text-main)] italic">
          "{insight.insight_text}"
        </p>

        <div className="bg-[var(--primary-navy)] p-8 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <h4 className="border-b border-white/10 pb-2 mb-4">Tomorrow's Milestone</h4>
          <p className="text-2xl font-black italic text-orange-400 leading-tight uppercase">
            {insight.tomorrow_micro_goal}
          </p>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button className="flex items-center gap-3 group text-gray-400 font-bold uppercase text-xs tracking-widest hover:text-[var(--accent-orange)] transition-colors">
          <ThumbsUp size={18} className="group-hover:scale-125 transition-transform" />
          <span>Helpful Insight</span>
        </button>
      </div>
    </div>
  )
}
