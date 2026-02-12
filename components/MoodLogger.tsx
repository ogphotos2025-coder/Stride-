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
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        {moods.map((mood) => (
          <button
            key={mood.name}
            onClick={() => setSelectedMood(mood.name)}
            className={`flex flex-col items-center gap-4 rounded-2xl p-6 transition-all duration-300 border-2 ${selectedMood === mood.name
              ? 'bg-white border-[var(--accent-orange)] text-[var(--accent-orange)] shadow-xl scale-110'
              : 'bg-white/50 border-transparent text-gray-400 hover:bg-white hover:border-gray-200'
              }`}
          >
            <div className={`transition-transform duration-300 ${selectedMood === mood.name ? 'scale-125' : ''}`}>
              {mood.icon}
            </div>
            <span className="text-xs font-black uppercase tracking-widest">{mood.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
