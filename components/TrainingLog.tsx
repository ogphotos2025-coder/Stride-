'use client'
import { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import { BookOpen, Calendar, ChevronRight } from 'lucide-react'

export default function TrainingLog() {
    const [entries, setEntries] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch('/api/history')
                if (response.ok) {
                    const data = await response.json()
                    setEntries(data)
                }
            } catch (err) {
                console.error('Failed to fetch history')
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [])

    if (loading) return <div className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest animate-pulse">Loading Archive...</div>

    if (entries.length === 0) {
        return (
            <div className="marathon-card bg-gray-50 border-gray-200 text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-400 uppercase tracking-tighter">No Training Data Found</h3>
                <p className="text-gray-400 text-sm mt-2">Your journey begins with your first entry.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {entries.map((entry) => (
                <div key={entry.id} className="marathon-card bg-white hover:border-[var(--accent-orange)] transition-all group cursor-pointer border-l-4 border-l-[var(--primary-navy)]">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            <div className="bg-blue-50 p-3 rounded-lg text-[var(--primary-navy)]">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h4 className="text-lg font-black italic uppercase text-[var(--primary-navy)] leading-none">
                                    {format(parseISO(entry.date), 'EEEE, MMM do')}
                                </h4>
                                <div className="flex gap-3 mt-2">
                                    <span className="px-2 py-0.5 bg-orange-100 text-[var(--accent-orange)] text-[10px] font-black rounded uppercase tracking-wider">
                                        {entry.mood}
                                    </span>
                                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                        {entry.step_count.toLocaleString()} STEPS
                                    </span>
                                </div>
                            </div>
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-[var(--accent-orange)] transition-colors" />
                    </div>
                    {entry.journal_entry && (
                        <p className="mt-4 text-sm text-gray-600 line-clamp-2 italic leading-relaxed">
                            "{entry.journal_entry}"
                        </p>
                    )}
                </div>
            ))}
        </div>
    )
}
