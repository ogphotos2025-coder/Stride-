'use client'
import { Smile, Frown, Meh, Laugh, Angry } from 'lucide-react'

const moods = [
  { name: 'Happy', icon: <Laugh size={32} /> },
  { name: 'Good', icon: <Smile size={32} /> },
  { name: 'Okay', icon: <Meh size={32} /> },
  { name: 'Sad', icon: <Frown size={32} /> },
  { name: 'Angry', icon: <Angry size={32} /> },
]

interface MoodLoggerProps {
  selectedMood: string | null
  setSelectedMood: (mood: string) => void
}

export default function MoodLogger({
  selectedMood,
  setSelectedMood,
}: MoodLoggerProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800">How are you feeling?</h3>
      <div className="mt-4 flex justify-around">
        {moods.map((mood) => (
          <button
            key={mood.name}
            onClick={() => setSelectedMood(mood.name)}
            className={`flex flex-col items-center gap-2 rounded-lg p-3 transition-all duration-200 ${
              selectedMood === mood.name
                ? 'bg-primary-100 text-primary-600'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {mood.icon}
            <span className="text-xs font-medium">{mood.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
