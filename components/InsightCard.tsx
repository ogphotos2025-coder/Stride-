'use client'
import { ThumbsUp } from 'lucide-react'

export default function InsightCard() {
  const insight = {
    detected_mood: 'Numb/Disconnected',
    sentiment_score: 3,
    insight_text:
      "Your body moved less today, and your words feel a bit flat. Movement pumps fresh oxygen to your brain—even a 10-minute walk can shift the fog. You're not broken; you just need circulation.",
    tomorrow_micro_goal: 'Take a 15-minute walk outside tomorrow morning',
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800">Soul's Insight</h3>
      <div className="mt-4 space-y-4">
        <p className="text-sm text-gray-700">{insight.insight_text}</p>
        <div>
          <h4 className="font-semibold text-gray-600">Tomorrow's Goal:</h4>
          <p className="text-sm text-primary-600">
            {insight.tomorrow_micro_goal}
          </p>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200">
          <ThumbsUp size={16} />
          <span>Helpful</span>
        </button>
      </div>
    </div>
  )
}
