'use client'
import { useState } from 'react'
import MoodLogger from '@/components/MoodLogger'
import JournalEntry from '@/components/JournalEntry'
import StepCounter from '@/components/StepCounter'
import InsightCard from '@/components/InsightCard'
import WeeklyChart from '@/components/WeeklyChart'
import Link from 'next/link'
import { Settings } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { format } from 'date-fns'

export default function Home() {
  const { data: session } = useSession()
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [journalEntryText, setJournalEntryText] = useState('')
  const [dailySteps, setDailySteps] = useState<number>(0)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSaveEntry = async () => {
    if (!session?.user?.id) {
      setSaveError('Sign in to sync your progress.')
      return
    }
    if (!selectedMood) {
      setSaveError('Record your mental state.')
      return
    }

    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      const response = await fetch('/api/daily-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: selectedMood,
          journal_entry: journalEntryText,
          step_count: dailySteps,
          date: format(new Date(), 'yyyy-MM-dd'),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to finish.')
      }

      setSaveSuccess(true)
    } catch (error: any) {
      setSaveError(error.message || 'Connection error.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="min-h-screen pb-20">
      {/* Marathon Header - Straightened */}
      <header className="bg-[var(--primary-navy)] text-white py-12 px-6 mb-12 shadow-xl border-b-4 border-[var(--accent-orange)]">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-6xl italic leading-none">Stride & Soul</h1>
            <p className="text-orange-400 font-bold tracking-widest mt-2">BELIEVE IN EVERY STEP</p>
          </div>
          <Link href="/settings" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <Settings className="h-8 w-8 text-white" />
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Logging */}
          <div className="lg:col-span-7 space-y-12">
            <div className="marathon-card bg-blue-50 border-blue-100 border-l-8 border-l-[var(--primary-navy)]">
              <h2 className="text-3xl mb-6 text-[var(--primary-navy)]">Mood Entry</h2>
              <MoodLogger
                selectedMood={selectedMood}
                setSelectedMood={setSelectedMood}
              />
            </div>

            <div className="marathon-card">
              <h2 className="text-3xl mb-4">Training Progress</h2>
              <StepCounter dailySteps={dailySteps} setDailySteps={setDailySteps} />
            </div>

            <div className="marathon-card bg-[var(--primary-navy)] text-white border-none shadow-2xl">
              <JournalEntry
                journalEntryText={journalEntryText}
                setJournalEntryText={setJournalEntryText}
                onSave={handleSaveEntry}
                isSaving={isSaving}
                saveError={saveError}
                saveSuccess={saveSuccess}
              />
            </div>
          </div>

          {/* Right Column: Insights */}
          <div className="lg:col-span-5 space-y-12">
            <div className="sticky top-12 space-y-12">
              <section>
                <h2 className="text-4xl mb-6 flex items-center gap-3 italic">
                  <span className="w-2 h-10 bg-[var(--accent-orange)] block"></span>
                  Soul Insights
                </h2>
                <InsightCard />
              </section>

              <section>
                <h2 className="text-4xl mb-6 flex items-center gap-3 italic">
                  <span className="w-2 h-10 bg-[var(--primary-navy)] block"></span>
                  Weekly Stride
                </h2>
                <WeeklyChart />
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
