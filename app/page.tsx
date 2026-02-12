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

export default function Home() {
  const { data: session } = useSession()
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [journalEntryText, setJournalEntryText] = useState('')
  const [dailySteps, setDailySteps] = useState<number>(0)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSaveEntry = async () => {
    console.log('Session object during save attempt:', session);
    if (!session?.user?.id) {
      setSaveError('You must be signed in to save entries.')
      return
    }
    if (!selectedMood) {
      setSaveError('Please select a mood.')
      return
    }
    if (dailySteps <= 0) {
      setSaveError('Please enter your daily steps.')
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
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save entry.')
      }

      setSaveSuccess(true)
      // Optionally reset form fields or show a success message
    } catch (error: any) {
      setSaveError(error.message || 'An unexpected error occurred.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Stride & Soul
        </p>
        <div className="fixed right-0 top-0 flex h-16 items-center pr-4 lg:static">
          <Link href="/settings">
            <Settings className="h-6 w-6 text-gray-500 hover:text-gray-700" />
          </Link>
        </div>
      </div>

      <div className="w-full max-w-5xl pt-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-8">
            <MoodLogger
              selectedMood={selectedMood}
              setSelectedMood={setSelectedMood}
            />
            <StepCounter dailySteps={dailySteps} setDailySteps={setDailySteps} />
            <JournalEntry
              journalEntryText={journalEntryText}
              setJournalEntryText={setJournalEntryText}
              onSave={handleSaveEntry}
              isSaving={isSaving}
              saveError={saveError}
              saveSuccess={saveSuccess}
            />
          </div>
          <div className="flex flex-col gap-8">
            <InsightCard />
            <WeeklyChart />
          </div>
        </div>
      </div>
    </main>
  )
}
